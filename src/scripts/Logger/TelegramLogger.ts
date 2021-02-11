import {LogGenerator} from "./LogGenerator";
const TgData = require('./TgData');
const fetch = require('node-fetch');

export class TelegramLogger implements Logger {


   private logGen: LogGenerator;

   constructor(logGen: LogGenerator) {
      this.logGen = logGen;
   }

   //todo
   log(): void {
      fetch(this.genUrl(), {
         method: 'GET'
      });
   };

   genUrl() {
      const text = encodeURIComponent(this.logGen.generate());
      return `https://api.telegram.org/bot${TgData.token}/sendMessage?chat_id=${TgData.channelID}&text=${text}`;
   }

}