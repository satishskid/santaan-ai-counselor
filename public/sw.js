// Service Worker for Santaan Patient App
// Provides offline functionality and caching

const CACHE_NAME = 'santaan-patient-app-v1.0.0';
const STATIC_CACHE_NAME = 'santaan-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'santaan-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/patient-app',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/patients/',
  '/api/interventions/',
  '/api/resources/',
  '/api/progress/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle patient app routes
  if (url.pathname.startsWith('/patient-app')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/patient-app');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Return offline data structure
              return new Response(
                JSON.stringify({
                  offline: true,
                  message: 'You are currently offline. Showing cached data.',
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        return cachedResponse || fetch(request)
          .then((response) => {
            // Cache new static assets
            if (response.status === 200 && request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(syncPatientData());
  }
  
  if (event.tag === 'sync-progress-updates') {
    event.waitUntil(syncProgressUpdates());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/patient-app'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Santaan Patient App', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/patient-app')
    );
  }
});

// Helper functions
async function syncPatientData() {
  try {
    // Sync offline patient data changes
    console.log('Service Worker: Syncing patient data...');
    
    // Get offline data from IndexedDB or localStorage
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Send to server
      const response = await fetch('/api/sync/patient-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineData)
      });
      
      if (response.ok) {
        // Clear offline data
        await clearOfflineData();
        console.log('Service Worker: Patient data synced successfully');
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing patient data', error);
  }
}

async function syncProgressUpdates() {
  try {
    console.log('Service Worker: Syncing progress updates...');
    
    // Sync progress updates made while offline
    const progressUpdates = await getOfflineProgressUpdates();
    
    if (progressUpdates.length > 0) {
      const response = await fetch('/api/sync/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressUpdates)
      });
      
      if (response.ok) {
        await clearOfflineProgressUpdates();
        console.log('Service Worker: Progress updates synced successfully');
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing progress updates', error);
  }
}

async function getOfflineData() {
  // Implementation would use IndexedDB or localStorage
  return [];
}

async function clearOfflineData() {
  // Implementation would clear IndexedDB or localStorage
}

async function getOfflineProgressUpdates() {
  // Implementation would get progress updates from storage
  return [];
}

async function clearOfflineProgressUpdates() {
  // Implementation would clear progress updates from storage
}

// Install prompt handling
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('Service Worker: Install prompt available');
  event.preventDefault();
  
  // Store the event for later use
  self.deferredPrompt = event;
  
  // Notify the app that install is available
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'INSTALL_AVAILABLE'
      });
    });
  });
});

// App installed
self.addEventListener('appinstalled', (event) => {
  console.log('Service Worker: App installed successfully');
  
  // Track installation
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'APP_INSTALLED'
      });
    });
  });
});
