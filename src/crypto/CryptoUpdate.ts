import NodeCache from "node-cache";
import axios from "axios";
import Main from "../Main";
import Proxy from "../proxies/Proxy";

export default class CryptoUpdate {
    private readonly main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    public startUpdates(): void {
        const update = () => {
            axios.get("https://api.binance.com/api/v3/ticker/24hr").then((response) => {

                let array = {};
                response.data.forEach((object: any) => {
                    // @ts-ignore
                    array[object.symbol] = object;
                })
                this.main.getCache().set("crypto", array);
            }).catch((err) => {
                console.log("Une erreur est survenue: " + err);
            });
        }


        update();
        setInterval(() => {
            update();
        }, 1000 * 10);
    }
}