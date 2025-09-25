import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private inactivityTimeout: any;
  private readonly TIMEOUT_DURATION = 60 * 60 * 1000;
  private activitySubject = new Subject<void>();
  public sessionTimeoutSubject = new Subject<void>();

  constructor(private router: Router, private toastr: ToastrService) {
    this.setupActivityTracking();
  }

  // Initialize the session timeout
  initSessionTimeout() {
    this.resetTimeout();
  }

  // Reset the timeout on user activity
  resetTimeout() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logoutDueToInactivity();
    }, this.TIMEOUT_DURATION);
  }

  // Track user activity (mouse move, click, key press, touch, window scroll, table scroll)
  setupActivityTracking(tableElements?: HTMLElement[]) {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];

    // Listen for activity on window
    activityEvents.forEach(event => {
      window.addEventListener(event, this.handleActivity);
    });

    // Also listen for scroll on each table element
    if (tableElements) {
      tableElements.forEach(table => {
        table.addEventListener('scroll', this.handleActivity);
      });
    }

    this.activitySubject.subscribe(() => {
      this.resetTimeout();
    });
  }

  private handleActivity = () => {
    this.activitySubject.next();
  };

  // Handle logout due to inactivity
  private logoutDueToInactivity() {
    if (Swal.isVisible()) {
      Swal.close();
    }
    this.toastr.clear();
    this.sessionTimeoutSubject.next();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Clean up event listeners and timeout
  cleanup(tableElements?: HTMLElement[]) {
    clearTimeout(this.inactivityTimeout);

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    activityEvents.forEach(event => {
      window.removeEventListener(event, this.handleActivity);
    });

    if (tableElements) {
      tableElements.forEach(table => {
        table.removeEventListener('scroll', this.handleActivity);
      });
    }
  }


}
