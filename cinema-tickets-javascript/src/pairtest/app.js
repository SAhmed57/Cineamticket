import TicketService from './TicketService.js';
import TicketTypeRequest from './lib/TicketTypeRequest.js';

const ticketService = new TicketService();

const request1 = new TicketTypeRequest('ADULT', 2);
const request2 = new TicketTypeRequest('CHILD', 1);
const request3 = new TicketTypeRequest('INFANT', 1);

try {
   ticketService.purchaseTickets(1, request1, request2, request3);
} catch (error) {
   console.log(error.message);
}
