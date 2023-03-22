export default class FakeWallet {
    private amount: number = 18.5;

    constructor(amount: number) {
        this.amount = amount;
    }

    public getAmount(): number {return this.amount;}

    public addMoney(money: number): number {
        this.amount += money;
        return this.getAmount();
    }

    public removeMoney(money: number): number {
        this.amount -= money;
        if (this.getAmount() <= 0) this.amount = 0;
        return this.getAmount();
    }

    public setMoney(money: number): number {
        this.amount = money;
        if (this.getAmount() <= 0) this.amount = 0;
        return this.getAmount();
    }
}