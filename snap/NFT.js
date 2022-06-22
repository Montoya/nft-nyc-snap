import { constructNotifications, fetchEvents } from "./utils";

export async function addNFT (contractAddress, id) {
    const currState = await getNFTWatchList();

    if (currState[contractAddress] && currState[contractAddress][id]) {
        throw new Error('Already watching this NFT.');
    }

    const currContractState = currState[contractAddress] ?? {};
    const newState = {
        ...currState,
        [contractAddress]: { ...currContractState, [id]: { lastRequested: 0 } },
    };

    await wallet.request({
        method: 'snap_manageState',
        params: ['update', newState]
    });
}

export async function removeNFT(contractAddress, id) {
    const newState = await getNFTWatchList();

    if (!newState[contractAddress] || !newState[contractAddress][id]) {
        throw new Error('Not currently watching this NFT.');
    }

    delete newState[contractAddress][id];

    await wallet.request({
        method: 'snap_manageState',
        params: ['update', newState]
    });
}

export async function removeAllNFTs() {
    await wallet.request({
        method: 'snap_manageState',
        params: ['update', {}]
    });
}

let interval;

export async function startWatching() {
    if (interval) throw new Error('Already watching!');
    const header = 'NFT watch request'
    const message = 'Would you like to watch your list of NFTs?'
    const res = await wallet.request({
        method: 'snap_confirm',
        params: [{ prompt: header, textAreaContent: message }],
      });
    if (!res) throw new Error('Watch request denied');
    const twoMinutes = 1000 * 60 * 2;
    interval = setInterval(async () => {
        const eventsLists = await fetchEvents();
        const notifications = constructNotifications(eventsLists);
        await sendNotifications(notifications);
    }, twoMinutes); 
}

export function stopWatching() {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
}

export async function getNFTWatchList() {
    const list = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
    });
    if (!list) return {};
    return list;
}

async function sendNotifications(notifications) {
    for (const notification of notifications) {
        setTimeout(async () => {
            await wallet.request({
                method: 'snap_notify',
                params: [
                    {
                        type: 'native',
                        message: `${notification.name} had a ${notification.eventType} event on ${notification.eventTimestamp}`
                    }
                ],
            });
        }, 1000);
    }
}

