import { getNFTWatchList } from './NFT';

async function updateTimestamps(currList, addressAndIdPairs, timestamp) {
    if (!addressAndIdPairs.length) return;
    const newList = { ...currList };
    for (const pair of addressAndIdPairs) {
        const [address, id] = pair;
        newList[address][id]['lastRequested'] = timestamp;
    }
    await wallet.request({
        method: 'snap_updateState',
        params: ['update', newList]
    });
}

export async function fetchEvents() {
    const currList = await getNFTWatchList();
    const addresses = Object.keys(currList);
    const eventPromises = [];

    for (const address of addresses) {
        const ids = Object.keys(address);
        for (const id of ids) {
            const { lastRequested } = currList[address][id];
            eventPromises.push(fetch(`https://testnets-api.opensea.io/api/v1/events?only_opensea=true&limit=5&asset_contract_address=${address}&token_id=${id}&occurred_after=${lastRequested}`, {
                headers: {
                    'Accept': 'application/json',
                } 
             }));
        }
    }

    const eventsLists = (await Promise.allSettled(eventPromises))
        .filter(
        promise => promise.status === 'fulfilled')
        .map(promise => promise.value.asset_events);

    const addressAndIdPairs = constructContractAddressAndIdTuples(eventsLists);

    const time = (new Date()).getTime() / 1000;

    await updateTimestamps(currList, addressAndIdPairs, time)

    return eventsLists;
}

function constructContractAddressAndIdTuples(lists) {
    const tuples = new Set();

    for (const list of lists) {
        for (const item of list) {
            tuples.push([
                item.asset.asset_contract.address, 
                item.asset.token_id,
            ]);
        }
    }
    
    return [...tuples];
}

export function constructNotifications(eventsLists) {
    const notifications = [];

    for (const list of eventsLists) {
        for (const item of list) {
            notifications.push({
                name: item.asset.name,
                eventType: item.event_type,
                eventTimestamp: item.event_timestamp,
            })
        }
    }

    return notifications;
}



