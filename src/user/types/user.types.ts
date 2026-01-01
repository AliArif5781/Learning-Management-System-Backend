export enum Role {
  // for constant values.
  Admin = 'Admin',
  Student = 'Student',
}

export type UpdateProfileDto = {
  firstName: string;
  lastName: string;
  profession?: string;
  Education?: string;
  techStack?: string;
  country?: string;
};
