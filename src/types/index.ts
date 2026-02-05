export interface Session {
  id: string;
  name: string;
}

export interface Degree {
  id: string;
  name: string;
}

export interface Brother {
  id: string;
  name: string;
  email?: string;
}

export interface Worker {
  id: string;
  name: string;
}

export interface Power {
  id: string;
  name: string;
}

export interface Certificate {
  id: string;
  sessionName: string;
  degreeName: string;
  brotherName: string;
  brotherEmail?: string;
  workerName: string;
  powerName: string;
  certificateDate: string;
  createdAt: string;
}
