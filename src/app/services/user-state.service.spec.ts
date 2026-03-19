import { TestBed } from '@angular/core/testing';
import { UserStateService, UserProfile } from './user-state.service';

const MOCK_PROFILE: UserProfile = {
  uid: 'firebase-uid-123',
  role: 'student',
  status: 'active',
  firstName: 'Болд',
};

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStateService);
  });

  // ── 1. Initial state ───────────────────────────────────────────────────────

  it('profile$ emits null before any profile is set', (done) => {
    service.profile$.subscribe(p => {
      expect(p).toBeNull();
      done();
    });
  });

  // ── 2. setProfile ──────────────────────────────────────────────────────────

  it('profile$ emits the profile after setProfile()', (done) => {
    service.setProfile(MOCK_PROFILE);
    service.profile$.subscribe(p => {
      expect(p).toEqual(MOCK_PROFILE);
      done();
    });
  });

  // ── 3. snapshot ────────────────────────────────────────────────────────────

  it('snapshot returns null before setProfile()', () => {
    expect(service.snapshot).toBeNull();
  });

  it('snapshot returns the profile after setProfile()', () => {
    service.setProfile(MOCK_PROFILE);
    expect(service.snapshot).toEqual(MOCK_PROFILE);
  });

  // ── 4. role$ and status$ ──────────────────────────────────────────────────

  it('role$ emits null when unauthenticated and the role when profile is set', (done) => {
    const emitted: (string | null)[] = [];
    const sub = service.role$.subscribe(r => emitted.push(r));
    service.setProfile(MOCK_PROFILE);
    sub.unsubscribe();
    expect(emitted).toEqual([null, 'student']);
    done();
  });

  it('status$ emits null when unauthenticated and the status when profile is set', (done) => {
    const emitted: (string | null)[] = [];
    const sub = service.status$.subscribe(s => emitted.push(s));
    service.setProfile(MOCK_PROFILE);
    sub.unsubscribe();
    expect(emitted).toEqual([null, 'active']);
    done();
  });

  // ── 5. uid$ ───────────────────────────────────────────────────────────────

  it('uid$ emits the uid once the profile is set', (done) => {
    service.setProfile(MOCK_PROFILE);
    service.uid$.subscribe(uid => {
      expect(uid).toBe('firebase-uid-123');
      done();
    });
  });

  it('uid$ does not emit before a profile is set', () => {
    let emitted = false;
    service.uid$.subscribe(() => { emitted = true; });
    expect(emitted).toBeFalse();
  });

  // ── 6. patch ──────────────────────────────────────────────────────────────

  it('patch() merges firstName into the existing profile', (done) => {
    service.setProfile(MOCK_PROFILE);
    service.patch({ firstName: 'Мөнх' });
    service.profile$.subscribe(p => {
      expect(p?.firstName).toBe('Мөнх');
      expect(p?.role).toBe('student');    // unchanged
      expect(p?.uid).toBe('firebase-uid-123'); // unchanged
      done();
    });
  });

  it('patch() does nothing when no profile is set', () => {
    service.patch({ firstName: 'Мөнх' });
    expect(service.snapshot).toBeNull();
  });

  // ── 7. clearProfile ───────────────────────────────────────────────────────

  it('clearProfile() resets profile$ to null', (done) => {
    service.setProfile(MOCK_PROFILE);
    service.clearProfile();
    service.profile$.subscribe(p => {
      expect(p).toBeNull();
      done();
    });
  });

  it('clearProfile() resets snapshot to null', () => {
    service.setProfile(MOCK_PROFILE);
    service.clearProfile();
    expect(service.snapshot).toBeNull();
  });

  it('role$ emits null after clearProfile()', (done) => {
    service.setProfile(MOCK_PROFILE);
    service.clearProfile();
    service.role$.subscribe(r => {
      expect(r).toBeNull();
      done();
    });
  });
});
