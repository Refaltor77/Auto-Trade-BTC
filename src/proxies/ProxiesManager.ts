import fs from "fs";
import Proxy from "./Proxy";
import Logger from "../loggers/Logger";
import axios from 'axios';

// TODO: dev this class
export default class ProxiesManager {
    private readonly proxies: Proxy[];

    constructor() {
        this.proxies = [];
    }

    public generateProxies(logger: Logger): void {
        logger.info("Génération des proxies...");
        fs.readFile(__dirname + "../../../resources/proxies.txt", "utf-8",  (error, data) => {
            let lines = data.split("\n");
            let i = 0;
            lines.forEach((url) => {
                url = url.replace("\n", "");
                let [ip, port] = url.split(':');
                if (ip !== "" && port !== undefined) {
                    i++;
                    port = port.replaceAll("\r", "");
                    this.proxies.push(new Proxy(url, port));
                }
            });
            logger.info(i + " proxy en marche !");
            //this.testingProxies(logger);
        });
    }

    // en cours de dev
    public testingProxies(logger: Logger): void {
        logger.info("Test des proxies...");
        let allProxies = this.proxies;
        let index = allProxies.length - 1;
        // url testing proxies safely
        const url = 'https://jsonplaceholder.typicode.com/posts';

        allProxies.forEach((proxy: Proxy) => {
            console.log(index);
            if (index >= 0) {
                axios.get(url, {
                    proxy: {
                        host: proxy.getUrl(),
                        port: parseInt(proxy.getPort())
                    },
                }).then((response) => {
                    console.log(response.data)
                    if (index === 0) {
                        console.log(response.data);
                        let proxyEnable = 0;
                        allProxies.forEach((proxy: Proxy) => {
                            if (proxy.isValid()) proxyEnable++;
                        });
                    }
                }).catch((error) => {
                    proxy.setInvalid();
                })
            }
            index -= 1;
        });
    }

    public getRandomProxy(): object {
        let randomIndex = Math.floor(Math.random() * this.proxies.length);
        return this.proxies[randomIndex];
    }
}