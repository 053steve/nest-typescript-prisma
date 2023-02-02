import { AuthenticateRes } from "../auth.interface";


export class LoginResDto {

  idToken: string
  accessToken: string
  refreshToken: string


  constructor(authRes: AuthenticateRes) {

    this.idToken = authRes.idToken;
    this.accessToken = authRes.accessToken;
    this.refreshToken = authRes.refreshToken;
  }
}
