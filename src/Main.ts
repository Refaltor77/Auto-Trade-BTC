import Logger from "./loggers/Logger";
import FakeWallet from "./wallets/FakeWallet";
import NodeCache from "node-cache";
import CryptoUpdate from "./crypto/CryptoUpdate";
import BitcoinTrade from "./trades/BitcoinTrade";
import FakeBitcoinWallet from "./trades/FakeBitcoinWallet";

export default class Main {

    private readonly logger: Logger;
    private readonly wallet: FakeWallet;
    private readonly cache: NodeCache;
    private readonly cryptoUpdate: CryptoUpdate;
    private readonly fakeBitcoinWallet: FakeBitcoinWallet;
    //private readonly proxiesManager: ProxiesManager;



    constructor() {
        this.logger = new Logger();
        this.wallet = new FakeWallet(1000);
        this.cache = new NodeCache();
        this.cryptoUpdate = new CryptoUpdate(this);
        this.fakeBitcoinWallet = new FakeBitcoinWallet(this.wallet, this);
        //this.proxiesManager = new ProxiesManager();
    }

    public main(): void {
        this.getLogger().info("The script is started !");
        //this.proxiesManager.generateProxies(this.getLogger());

        this.cryptoUpdate.startUpdates();

        this.getLogger().info("Démarrage du trade dans 15 secondes.");
        setTimeout(() => {
            new BitcoinTrade(this).startTrades(this.wallet, this.fakeBitcoinWallet);
        }, 15000);
    }

    public getLogger(): Logger {return this.logger;}
    public getCache(): NodeCache {return this.cache;}
    //public getProxieManager(): ProxiesManager {return this.proxiesManager;}
}