//const path = require('path');
import path from 'path'
import fs from 'fs'
import data from '../db/data.json'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


class Ticket {
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {


    constructor() {
        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); // 11
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }


    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4 } = data;
        if ( hoy === this.hoy ) {
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro dia
            this.guardarDB();
        }
    }

    guardarDB() {
        const __dirname=process.argv[1]
        const dbPath = path.join( __dirname, '../db/data.json' );
        console.log(dbPath);
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );

    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket( escritorio ) {

        // No tenemos tickets
        if ( this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0];
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket );

        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1,1);
        }

        this.guardarDB();

        return ticket;
    }



}



export{TicketControl}