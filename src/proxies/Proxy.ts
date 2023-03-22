export default class Proxy {
    private readonly url: string;
    private readonly port: string;
    private is_valid: boolean;

    constructor(url: string, port: string) {
        this.url = url;
        this.port = port;
        this.is_valid = true;
    }


    public getUrl(): string {return this.url;}
    public getPort(): string {return this.port;}
    public isValid(): boolean {return this.is_valid;}


    public setInvalid(): void {
        this.is_valid = false;
    }

    public setValid(): void {
        this.is_valid = true;
    }
}