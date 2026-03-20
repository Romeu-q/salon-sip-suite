export interface Professional {
  id: string;
  name: string;
  specialty: string;
  commission: number;
  avatar: string;
  color: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  category: string;
  emoji: string;
}

export type AppointmentStatus = 'scheduled' | 'in-salon' | 'delayed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  professionalId: string;
  clientName: string;
  serviceName: string;
  startTime: string; // HH:mm
  duration: number;
  status: AppointmentStatus;
  price: number;
}

export const professionals: Professional[] = [
  { id: '1', name: 'Camila Rocha', specialty: 'Colorista', commission: 40, avatar: 'CR', color: 'hsl(38 50% 56%)' },
  { id: '2', name: 'Lucas Mendes', specialty: 'Barbeiro', commission: 35, avatar: 'LM', color: 'hsl(215 80% 56%)' },
  { id: '3', name: 'Beatriz Souza', specialty: 'Manicure', commission: 30, avatar: 'BS', color: 'hsl(152 55% 42%)' },
  { id: '4', name: 'Rafael Lima', specialty: 'Hair Stylist', commission: 45, avatar: 'RL', color: 'hsl(280 50% 55%)' },
];

export const services: Service[] = [
  { id: '1', name: 'Corte Feminino', price: 85, duration: 45, category: 'Cabelo' },
  { id: '2', name: 'Coloração', price: 180, duration: 90, category: 'Cabelo' },
  { id: '3', name: 'Escova Progressiva', price: 250, duration: 120, category: 'Cabelo' },
  { id: '4', name: 'Corte Masculino', price: 55, duration: 30, category: 'Barbearia' },
  { id: '5', name: 'Barba', price: 35, duration: 20, category: 'Barbearia' },
  { id: '6', name: 'Manicure', price: 40, duration: 40, category: 'Unhas' },
  { id: '7', name: 'Pedicure', price: 50, duration: 50, category: 'Unhas' },
  { id: '8', name: 'Hidratação Capilar', price: 120, duration: 60, category: 'Tratamento' },
  { id: '9', name: 'Combo Corte + Barba', price: 80, duration: 50, category: 'Barbearia' },
];

export const products: Product[] = [
  { id: '1', name: 'Espresso', costPrice: 1.2, salePrice: 6.5, stock: 200, minStock: 50, category: 'Café', emoji: '☕' },
  { id: '2', name: 'Cappuccino', costPrice: 2.0, salePrice: 9.0, stock: 150, minStock: 30, category: 'Café', emoji: '☕' },
  { id: '3', name: 'Suco Natural', costPrice: 3.0, salePrice: 12.0, stock: 40, minStock: 10, category: 'Bebidas', emoji: '🍊' },
  { id: '4', name: 'Água Mineral', costPrice: 0.8, salePrice: 4.0, stock: 100, minStock: 20, category: 'Bebidas', emoji: '💧' },
  { id: '5', name: 'Brownie', costPrice: 2.5, salePrice: 8.0, stock: 25, minStock: 8, category: 'Doces', emoji: '🍫' },
  { id: '6', name: 'Pão de Queijo', costPrice: 1.0, salePrice: 5.0, stock: 35, minStock: 10, category: 'Salgados', emoji: '🧀' },
  { id: '7', name: 'Croissant', costPrice: 2.0, salePrice: 7.5, stock: 18, minStock: 5, category: 'Salgados', emoji: '🥐' },
  { id: '8', name: 'Chá Gelado', costPrice: 1.5, salePrice: 7.0, stock: 60, minStock: 15, category: 'Bebidas', emoji: '🧊' },
];

export const todayAppointments: Appointment[] = [
  { id: '1', professionalId: '1', clientName: 'Marina Alves', serviceName: 'Coloração', startTime: '09:00', duration: 90, status: 'completed', price: 180 },
  { id: '2', professionalId: '1', clientName: 'Juliana Costa', serviceName: 'Escova Progressiva', startTime: '11:00', duration: 120, status: 'in-salon', price: 250 },
  { id: '3', professionalId: '2', clientName: 'Pedro Santos', serviceName: 'Combo Corte + Barba', startTime: '09:30', duration: 50, status: 'completed', price: 80 },
  { id: '4', professionalId: '2', clientName: 'Marcos Oliveira', serviceName: 'Corte Masculino', startTime: '10:30', duration: 30, status: 'delayed', price: 55 },
  { id: '5', professionalId: '2', clientName: 'Thiago Reis', serviceName: 'Barba', startTime: '11:30', duration: 20, status: 'scheduled', price: 35 },
  { id: '6', professionalId: '3', clientName: 'Ana Paula Ferreira', serviceName: 'Manicure', startTime: '09:00', duration: 40, status: 'completed', price: 40 },
  { id: '7', professionalId: '3', clientName: 'Carla Dias', serviceName: 'Pedicure', startTime: '10:00', duration: 50, status: 'completed', price: 50 },
  { id: '8', professionalId: '3', clientName: 'Fernanda Lima', serviceName: 'Manicure', startTime: '11:00', duration: 40, status: 'in-salon', price: 40 },
  { id: '9', professionalId: '4', clientName: 'Isabela Martins', serviceName: 'Corte Feminino', startTime: '10:00', duration: 45, status: 'completed', price: 85 },
  { id: '10', professionalId: '4', clientName: 'Renata Gomes', serviceName: 'Hidratação Capilar', startTime: '11:00', duration: 60, status: 'scheduled', price: 120 },
  { id: '11', professionalId: '1', clientName: 'Tatiana Nunes', serviceName: 'Corte Feminino', startTime: '14:00', duration: 45, status: 'scheduled', price: 85 },
  { id: '12', professionalId: '4', clientName: 'Luciana Barbosa', serviceName: 'Coloração', startTime: '14:00', duration: 90, status: 'scheduled', price: 180 },
];

export const financialData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 28400, expenses: 18200 },
    { month: 'Fev', revenue: 31200, expenses: 19100 },
    { month: 'Mar', revenue: 29800, expenses: 17800 },
    { month: 'Abr', revenue: 34500, expenses: 20300 },
    { month: 'Mai', revenue: 37200, expenses: 21500 },
    { month: 'Jun', revenue: 35800, expenses: 20800 },
  ],
  todayStats: {
    revenue: 2340,
    appointments: 12,
    avgTicket: 195,
    occupancy: 78,
  },
};
