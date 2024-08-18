export class Person {
  name: string;
  age: number;
  images: string[];
  infos: string[];

  constructor(name: string, age: number, images: string[], infos: string[]) {
    this.name = name;
    this.age = age;
    this.images = images;
    this.infos = infos;
  }
}