export interface TicketInfo {
  price: number;
  description: string;
}

export interface Exhibition {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface MuseumDetails {
  id: string;
  name: string;
  description: string;
  ticketingInfo: {
    [key: string]: TicketInfo;
  };
  openingHours: {
    [key: string]: string;
  };
  location: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  exhibitions: Exhibition[];
  facilities: string[];
}