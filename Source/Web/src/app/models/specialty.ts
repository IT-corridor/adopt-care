import { IHaveId } from "./ihaveid";

export interface ISpecialty extends IHaveId {
  name?: string;
  physician_specialty?: boolean;
}

//export class Specialty {
//	id: string;
//	name: string;
//	physician_specialty: boolean;
//}
