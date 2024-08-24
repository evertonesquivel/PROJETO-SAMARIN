import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class MainSectionService {

  // Lista de pessoas com os novos campos adicionados
  people: Person[] = [
    {
      id: 1,
      name: 'Samarina',
      age: 25,
      images: ['/assets/i7.png', '/assets/i2.jpeg'],
      infos: ['Software Engineer', 'Likes hiking', 'Foodie'],
      email: 'samarina@sam.com',
      nickname: 'Sam',
      password: 'password1'
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 30,
      images: ['/assets/i3.jpeg', '/assets/i4.jpeg'],
      infos: ['Marketing Specialist', 'Loves reading', 'Traveler'],
      email: 'jane.smith@sam.com',
      nickname: 'Jane',
      password: 'password2'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      age: 28,
      images: ['/assets/i5.jpeg', '/assets/i6.jpeg'],
      infos: ['Data Scientist', 'Enjoys playing guitar', 'Food enthusiast'],
      email: 'bob.johnson@sam.com',
      nickname: 'Bob',
      password: 'password3'
    },
    {
      id: 4,
      name: 'Alice Brown',
      age: 29,
      images: ['/assets/i7.png', '/assets/i1.jpeg'],
      infos: ['Graphic Designer', 'Loves yoga', 'Animal lover'],
      email: 'alice.brown@sam.com',
      nickname: 'Alice',
      password: 'password4'
    },
    {
      id: 5,
      name: 'Mike Davis',
      age: 32,
      images: ['/assets/i2.jpeg', '/assets/i3.jpeg'],
      infos: ['Software Developer', 'Enjoys playing basketball', 'Music lover'],
      email: 'mike.davis@sam.com',
      nickname: 'Mike',
      password: 'password5'
    },
    {
      id: 6,
      name: 'Emily Chen',
      age: 27,
      images: ['/assets/i4.jpeg', '/assets/i5.jpeg'],
      infos: ['Product Manager', 'Loves hiking', 'Foodie'],
      email: 'emily.chen@sam.com',
      nickname: 'Emily',
      password: 'password6'
    },
    {
      id: 7,
      name: 'David Lee',
      age: 31,
      images: ['/assets/i6.jpeg', '/assets/i2.jpeg'],
      infos: ['UX Designer', 'Enjoys playing tennis', 'Traveler'],
      email: 'david.lee@sam.com',
      nickname: 'David',
      password: 'password7'
    },
    {
      id: 8,
      name: 'Sarah Taylor',
      age: 26,
      images: ['/assets/i1.jpeg', '/assets/i5.jpeg'],
      infos: ['Frontend Developer', 'Loves reading', 'Animal lover'],
      email: 'sarah.taylor@sam.com',
      nickname: 'Sarah',
      password: 'password8'
    }
  ];

  constructor() { }

  getPeople(): Person[] {
    return this.people;
  }

  getPersonById(id: number): Person | undefined {
    return this.people.find(person => person.id === id);
  }
}
