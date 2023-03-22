import FakeWallet from "../wallets/FakeWallet";
import Main from "../Main";


export default class FakeBitcoinWallet {
    private readonly wallet: FakeWallet;
    private readonly main: Main;
    private bitcoin: number;

    constructor(wallet: FakeWallet, main: Main) {
        this.wallet = wallet;
        this.bitcoin = 0;
        this.main = main;
    }


    public canBuyBitcoin(amount: number): boolean {
        return this.getWallet().getAmount() >= amount;
    }

    public getBitcoinMoney(): string {
        // @ts-ignore
        let bitcoinPrice = this.main.getCache().get('crypto')['BTCUSDT']['lastPrice'];
        return Number(this.getBitcoin() * bitcoinPrice).toFixed(2);
    }

    public buyBitcoin(amount: number): number {
        // @ts-ignore
        let bitcoinPrice = this.main.getCache().get('crypto')['BTCUSDT']['lastPrice'];
        if (this.canBuyBitcoin(amount)) {
            let bitcoinAmount = amount / bitcoinPrice;
            this.getWallet().removeMoney(amount);
            this.bitcoin += bitcoinAmount;
        } else {
            this.main.getLogger().error("Pas assez d'argent pour acheter du bitcoin.");
        }
        return this.bitcoin;
    }

    public sellAllBitcoin(): void {
        // @ts-ignore
        let bitcoinPrice = this.main.getCache().get('crypto')['BTCUSDT']['lastPrice'];
        let bitcoinAmount = this.getBitcoin();
        let money = bitcoinAmount * bitcoinPrice;
        this.getWallet().addMoney(money);
        const config = require("../../resources/log.json");
        this.bitcoin = 0;
    }

    public getBitcoin(): number {return this.bitcoin;}
    public getWallet(): FakeWallet {return this.wallet;}
}