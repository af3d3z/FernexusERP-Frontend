import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuardGuard } from './auth-guard.guard';
import { Auth, getAuth } from 'firebase/auth';
import { of } from 'rxjs';

describe('authGuardGuard', () => {
  let guard: authGuardGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockAuth: Partial<Auth>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockAuth = {
      onAuthStateChanged: (callback: (user: any) => void) => {
        callback({ uid: '12345' }); // Simula un usuario autenticado
        return () => {}; // Devuelve una función de limpieza vacía
      },
    } as Partial<Auth>;

    TestBed.configureTestingModule({
      providers: [
        authGuardGuard,
        { provide: Router, useValue: routerSpy },
        { provide: typeof getAuth, useValue: mockAuth },
      ],
    });

    guard = TestBed.inject(authGuardGuard);
  });

  it('should allow access when user is authenticated', async () => {
    const result = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeTrue();
  });

  it('should deny access and navigate to login when user is not authenticated', async () => {
    mockAuth.onAuthStateChanged = (callback) => {
      // @ts-ignore
      callback(null); // Simula un usuario no autenticado
      return () => {};
    };

    const result = await guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
