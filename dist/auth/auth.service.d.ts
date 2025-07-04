import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(userDto: any): Promise<{
        access_token: string;
    }>;
}
