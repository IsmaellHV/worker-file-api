import { Context } from 'hono';
import { IError } from '../../../types/IError';
import { getEnvironment } from '../../../env';

export class AdapterAuthorization {
  public static async validateAuthBasic(c: Context): Promise<string> {
    const header = c.req.header('Authorization');
    if (!header) throw new IError('No está autorizado para utilizar este servicio', 0, 401);

    const param = header.split(' ');
    if (param.length !== 2 || param[0].trim().toUpperCase() !== 'BASIC') {
      throw new IError('No está autorizado para utilizar este servicio', 0, 401);
    }

    let decoded: string;
    try {
      decoded = atob(param[1].trim());
    } catch {
      throw new IError('No está autorizado para utilizar este servicio', 0, 401);
    }

    const sep = decoded.indexOf(':');
    if (sep < 0) throw new IError('No está autorizado para utilizar este servicio', 0, 401);
    const usr = decoded.slice(0, sep);
    const pwd = decoded.slice(sep + 1);

    const list = getEnvironment(c).AUTH_BASIC;
    const ok = list.some((cred) => cred.usr === usr && cred.pwd === pwd);
    if (!ok) throw new IError('No está autorizado para utilizar este servicio', 0, 401);
    return usr;
  }
}
