const CACHE_NAME = 'alas-purwo-v1';
const urlsToCache = [
  '/',
  '/tickets',
  '/history',
  '/profile',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline ticket purchases
self.addEventListener('sync', (event) => {
  if (event.tag === 'ticket-purchase') {
    event.waitUntil(
      // Handle offline ticket purchase sync
      syncTicketPurchases()
    );
  }
});

async function syncTicketPurchases() {
  try {
    // Get pending ticket purchases from IndexedDB
    const pendingPurchases = await getPendingPurchases();
    
    for (const purchase of pendingPurchases) {
      try {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchase.data)
        });
        
        // Remove from pending purchases
        await removePendingPurchase(purchase.id);
      } catch (error) {
        console.error('Failed to sync ticket purchase:', error);
      }
    }
  } catch (error) {
    console.error('Failed to sync ticket purchases:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingPurchases() {
  // Implementation would use IndexedDB to store offline purchases
  return [];
}

async function removePendingPurchase(id) {
  // Implementation would remove purchase from IndexedDB
}

// Show notification when app is updated
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
