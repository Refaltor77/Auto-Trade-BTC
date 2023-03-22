import Main from "../Main";
import FakeWallet from "../wallets/FakeWallet";
import FakeBitcoinWallet from "./FakeBitcoinWallet";

export default class BitcoinTrade {
    private readonly main: Main;

    private lastBuyPrice = 0;
    private lastSellPrice = 0;
    private buyThreshold = 0;
    private sellThreshold = 0;
    private stopLoss = 0;

    constructor(main: Main) {
       this.main = main;
    }

    public startTrades(wallet: FakeWallet, bitcoinWallet: FakeBitcoinWallet): void {
        let main = this.getMain();
        let cache = main.getCache();
        let logger = main.getLogger();

        logger.info("Starting trades with Bitcoin.");


        const updateSellAndBuy = () => {
            let crypto: any = cache.get('crypto');
            let bitcoinInfo = crypto['BTCUSDT'];
            let lastPrice = bitcoinInfo['lastPrice'];


            this.sellThreshold = lastPrice * 1.0009;
            this.buyThreshold = lastPrice * 0.9997;
            this.stopLoss = lastPrice * 0.9985;
        }


        let blockInterval = false;

        updateSellAndBuy();
        setInterval(() => {
            if (blockInterval) {
                blockInterval = false;
            } else updateSellAndBuy();
        }, 1000 * 120);


        setInterval(() => {
            console.clear();
            let crypto: any = cache.get('crypto');
            if (crypto !== undefined && crypto !== null) {
                let bitcoinInfo = crypto['BTCUSDT'];
                let lastPrice = bitcoinInfo['lastPrice'];
                let highPrice = bitcoinInfo['highPrice'];
                let lowPrice = bitcoinInfo['lowPrice'];


                let now = new Date();
                let timestamp = `${now.toLocaleTimeString()}`;
                this.getMain().getLogger().info("----- [" + timestamp + "] -----");
                this.getMain().getLogger().info("Argent réel: " + wallet.getAmount() + "$");
                this.getMain().getLogger().info("Bitcoin: " + Number(bitcoinWallet.getBitcoin()).toFixed(6));
                this.getMain().getLogger().info("Bitcoin en $: " + bitcoinWallet.getBitcoinMoney() + "$");
                this.getMain().getLogger().info("Prix du bitcoin: " + Number(lastPrice).toFixed(2) + "$");
                this.getMain().getLogger().info("Prix achat bitcoin par le robot: " + Number(this.buyThreshold).toFixed(2) + "$");
                this.getMain().getLogger().info("Prix de vente bitcoin par le robot: " + Number(this.sellThreshold).toFixed(2) + "$");
                this.getMain().getLogger().info("Prix de vente bitcoin urgent par le robot: " + Number(this.stopLoss).toFixed(2) + "$");
                this.getMain().getLogger().info("----------");


                if (lastPrice >= this.sellThreshold && wallet.getAmount() > 0) {
                    updateSellAndBuy();
                    blockInterval = true;
                }


                if (wallet.getAmount() > 0) {
                    if (lastPrice < this.lastBuyPrice || lastPrice <= this.buyThreshold) {
                        bitcoinWallet.buyBitcoin(wallet.getAmount());
                        this.lastBuyPrice = lastPrice;
                        updateSellAndBuy();
                        blockInterval = true;
                    }
                }

                if (parseInt(bitcoinWallet.getBitcoinMoney()) > 0) {
                    if (lastPrice > this.lastSellPrice || lastPrice >= this.sellThreshold) {
                        bitcoinWallet.sellAllBitcoin();
                        this.lastSellPrice = lastPrice;
                        updateSellAndBuy();
                        blockInterval = true;
                    }
                }

                if (lastPrice <= this.stopLoss) {
                    if (parseInt(bitcoinWallet.getBitcoinMoney()) > 0) {
                        if (lastPrice > this.lastSellPrice || lastPrice >= this.sellThreshold) {
                            bitcoinWallet.sellAllBitcoin();
                            this.lastSellPrice = lastPrice;
                            updateSellAndBuy();
                            blockInterval = true;
                        }
                    }
                }
            }
        }, 1000 * 5);
    }

    public getMain(): Main {return this.main;}
}