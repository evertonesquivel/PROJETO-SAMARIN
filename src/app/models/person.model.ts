export interface Person {
  id: number;
  name: string;
  age: number;
  birth_date: string; // Manter este campo se ainda for necessário
  images: string[];
  infos: string[];
  email: string;
  user_tag: string;
  specific_interests:string;
  gender_identity: string;
  interest: string;
  ageRange: string;
  bio: string;
  pronouns: string; // Novo campo para pronomes
  sexualOrientation: string; // Novo campo para orientação sexual
  genderIdentity: string; // Novo campo para identidade de gênero
  personality: string; // Novo campo para personalidade
  hobbies: string; // Novo campo para hobbies
  min_age_interest: number; // Novo campo para idade mínima de interesse
  max_age_interest: number; // Novo campo para idade máxima de interesse
}


  // constructor(id: number, name: string, age: number, images: string[], infos: string[]) {
  //   this.id = id;
  //   this.name = name;
  //   this.age = age;
  //   this.images = images;
  //   this.infos = infos;
  // }
