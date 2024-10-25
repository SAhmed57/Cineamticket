// import TicketTypeRequest from './lib/TicketTypeRequest.js';
// import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

// export default class TicketService {
//   /**
//    * Should only have private methods other than the one below.
//    */

//   purchaseTickets(accountId, ...ticketTypeRequests) {
//     // throws InvalidPurchaseException
//   }
// }


import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from './thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from './thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!this.#isValidAccount(accountId)) {
      throw new InvalidPurchaseException('Invalid account id.');
    }

    // Calculate the total number of tickets requested and validate
    const { totalTickets, adultTickets, childTickets, infantTickets } = this.#getTicketCounts(ticketTypeRequests);
    
    if (totalTickets > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets.');
    }
    
    if (adultTickets === 0 && (childTickets > 0 || infantTickets > 0)) {
      throw new InvalidPurchaseException('Child or infant tickets cannot be purchased without an adult.');
    }

    // Calculate total payment
    const totalCost = this.#calculateTotalCost(adultTickets, childTickets);

    // Reserve seats (only for adult and child tickets)
    const totalSeatsToReserve = adultTickets + childTickets;
    this.#reserveSeats(accountId, totalSeatsToReserve);

    // Make the payment
    this.#makePayment(accountId, totalCost);
  }

  // Private method to validate the account
  #isValidAccount(accountId) {
    return accountId > 0; // All accounts with id > 0 are valid according to assumptions
  }

  // Private method to calculate ticket counts
  #getTicketCounts(ticketTypeRequests) {
    let totalTickets = 0, adultTickets = 0, childTickets = 0, infantTickets = 0;

    ticketTypeRequests.forEach(request => {
      const ticketType = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      totalTickets += noOfTickets;
      if (ticketType === 'ADULT') {
        adultTickets += noOfTickets;
      } else if (ticketType === 'CHILD') {
        childTickets += noOfTickets;
      } else if (ticketType === 'INFANT') {
        infantTickets += noOfTickets;
      }
    });

    return { totalTickets, adultTickets, childTickets, infantTickets };
  }

  // Private method to calculate the total cost of tickets
  #calculateTotalCost(adultTickets, childTickets) {
    const adultTicketPrice = 25;
    const childTicketPrice = 15;

    return (adultTickets * adultTicketPrice) + (childTickets * childTicketPrice);
  }

  // Private method to reserve seats
  #reserveSeats(accountId, totalSeats) {
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, totalSeats);
  }

  // Private method to make a payment
  #makePayment(accountId, totalAmount) {
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, totalAmount);
  }
}

