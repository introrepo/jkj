export interface Patient {
  id: string;
  nationalId: string;
  name: string;
  phone: string;
  age: number;
  nextAppointment?: Date;
  createdAt: Date;
}

export interface Visit {
  id: string;
  patientId: string;
  date: Date;
  treatment: string;
  medication: string;
  notes: string;
  nextAppointment?: Date;
}
