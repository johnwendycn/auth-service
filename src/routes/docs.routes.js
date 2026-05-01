// In your route handler (e.g., src/routes/docs.routes.js or app.js)
router.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const publicEndpoints = [
    // GET all features (with pagination)
    {
      id: 'get-features',
      method: 'GET',
      path: '/api/features',
      name: 'Get all features',
      description: 'Retrieve all active features with pagination. Supports limit and offset for pagination.',
      auth: null,
      isList: true,
      tableHeaders: ['ID', 'Title', 'Description', 'Category', 'Order', 'Active', 'Created At'],
      jsExample: `// Get all features with pagination
const getFeatures = async () => {
  try {
    const response = await fetch('${baseUrl}/api/features?limit=25&offset=0');
    const data = await response.json();
    console.log('Features:', data.data);
    console.log('Pagination:', data.pagination);
    return data;
  } catch (error) {
    console.error('Error fetching features:', error);
  }
};

getFeatures();`,
      response: {
        success: true,
        data: [
          {
            id: 1,
            title: "Seamless Integration",
            description: "Integrate with your favorite tools in seconds.",
            category: "integration",
            order: 1,
            is_active: true,
            created_at: "2026-05-01T12:00:00Z"
          }
        ],
        pagination: {
          limit: 25,
          offset: 0,
          total: 1
        }
      }
    },
    
    // GET feature by ID
    {
      id: 'get-feature-by-id',
      method: 'GET',
      path: '/api/features/:id',
      name: 'Get feature by ID',
      description: 'Retrieve a single feature by its ID.',
      auth: null,
      params: [
        { name: 'id', in: 'path', desc: 'Feature ID (required)' }
      ],
      jsExample: `// Get a single feature by ID
const getFeatureById = async (id) => {
  try {
    const response = await fetch('${baseUrl}/api/features/' + id);
    const data = await response.json();
    console.log('Feature:', data.data);
    return data;
  } catch (error) {
    console.error('Error fetching feature:', error);
  }
};

// Example: Get feature with ID 1
getFeatureById(1);`,
      response: {
        success: true,
        data: {
          id: 1,
          title: "Seamless Integration",
          description: "Integrate with your favorite tools in seconds.",
          image_url: "https://example.com/image.jpg",
          thumbnail_url: "https://example.com/thumb.jpg",
          category: "integration",
          order: 1,
          is_active: true,
          created_at: "2026-05-01T12:00:00Z",
          updated_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // GET features by category
    {
      id: 'get-features-by-category',
      method: 'GET',
      path: '/api/features/category/:category',
      name: 'Get features by category',
      description: 'Retrieve features filtered by category.',
      auth: null,
      params: [
        { name: 'category', in: 'path', desc: 'Feature category (e.g., integration, security, performance)' }
      ],
      jsExample: `// Get features by category
const getFeaturesByCategory = async (category) => {
  try {
    const response = await fetch('${baseUrl}/api/features/category/' + category);
    const data = await response.json();
    console.log(\`Features in category "\${category}":\`, data.data);
    return data;
  } catch (error) {
    console.error('Error fetching features by category:', error);
  }
};

// Example: Get features in 'integration' category
getFeaturesByCategory('integration');`,
      response: {
        success: true,
        data: [
          {
            id: 1,
            title: "Seamless Integration",
            category: "integration",
            order: 1
          }
        ],
        category: "integration"
      }
    },
    
    // GET all significants (with pagination)
    {
      id: 'get-significants',
      method: 'GET',
      path: '/api/significants',
      name: 'Get all significants',
      description: 'Retrieve all active significants with pagination. Supports limit and offset for pagination.',
      auth: null,
      isList: true,
      tableHeaders: ['ID', 'Title', 'Description', 'Priority', 'Highlight Text', 'Active', 'Created At'],
      jsExample: `// Get all significants with pagination
const getSignificants = async () => {
  try {
    const response = await fetch('${baseUrl}/api/significants?limit=25&offset=0');
    const data = await response.json();
    console.log('Significants:', data.data);
    console.log('Pagination:', data.pagination);
    return data;
  } catch (error) {
    console.error('Error fetching significants:', error);
  }
};

getSignificants();`,
      response: {
        success: true,
        data: [
          {
            id: 1,
            title: "Award-Winning Security",
            description: "Our platform is recognized for top-tier security standards.",
            priority: 1,
            highlight_text: "2026 Winner",
            is_active: true,
            created_at: "2026-05-01T12:00:00Z"
          }
        ],
        pagination: {
          limit: 25,
          offset: 0,
          total: 1
        }
      }
    },
    
    // GET significant by ID
    {
      id: 'get-significant-by-id',
      method: 'GET',
      path: '/api/significants/:id',
      name: 'Get significant by ID',
      description: 'Retrieve a single significant item by its ID.',
      auth: null,
      params: [
        { name: 'id', in: 'path', desc: 'Significant ID (required)' }
      ],
      jsExample: `// Get a single significant by ID
const getSignificantById = async (id) => {
  try {
    const response = await fetch('${baseUrl}/api/significants/' + id);
    const data = await response.json();
    console.log('Significant:', data.data);
    return data;
  } catch (error) {
    console.error('Error fetching significant:', error);
  }
};

// Example: Get significant with ID 1
getSignificantById(1);`,
      response: {
        success: true,
        data: {
          id: 1,
          title: "Award-Winning Security",
          description: "Our platform is recognized for top-tier security standards.",
          image_url: "https://example.com/image.jpg",
          thumbnail_url: "https://example.com/thumb.jpg",
          icon_url: "https://example.com/icon.svg",
          highlight_text: "2026 Winner",
          priority: 1,
          is_active: true,
          created_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // GET significants by priority
    {
      id: 'get-significants-by-priority',
      method: 'GET',
      path: '/api/significants/priority/:priority',
      name: 'Get significants by priority',
      description: 'Retrieve significants filtered by priority level.',
      auth: null,
      params: [
        { name: 'priority', in: 'path', desc: 'Priority level (higher number = higher priority)' }
      ],
      jsExample: `// Get significants by priority
const getSignificantsByPriority = async (priority) => {
  try {
    const response = await fetch('${baseUrl}/api/significants/priority/' + priority);
    const data = await response.json();
    console.log(\`Significants with priority \${priority}:\`, data.data);
    return data;
  } catch (error) {
    console.error('Error fetching significants by priority:', error);
  }
};

// Example: Get significants with priority 5
getSignificantsByPriority(5);`,
      response: {
        success: true,
        data: [
          {
            id: 1,
            title: "High Priority Item",
            priority: 5,
            highlight_text: "URGENT"
          }
        ],
        priority: 5
      }
    }
  ];
  
  const protectedEndpoints = [
    // CREATE feature (admin only)
    {
      id: 'create-feature',
      method: 'POST',
      path: '/api/features',
      name: 'Create feature',
      description: 'Create a new feature. Requires admin privileges.',
      auth: 'admin',
      body: {
        title: "New Feature",
        description: "Feature description",
        image_url: "https://example.com/image.jpg",
        thumbnail_url: "https://example.com/thumb.jpg",
        category: "new",
        order: 1
      },
      jsExample: `// Create a new feature (admin only)
const createFeature = async (featureData) => {
  try {
    const response = await fetch('${baseUrl}/api/features', {
      method: 'POST',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(featureData)
    });
    const data = await response.json();
    console.log('Feature created:', data.data);
    return data;
  } catch (error) {
    console.error('Error creating feature:', error);
  }
};

// Example usage
createFeature({
  title: "Awesome New Feature",
  description: "This feature will change everything!",
  image_url: "https://example.com/awesome.jpg",
  category: "featured",
  order: 1
});`,
      response: {
        success: true,
        message: "Feature created successfully",
        data: {
          id: 1,
          title: "Awesome New Feature",
          description: "This feature will change everything!",
          is_active: true,
          created_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // UPDATE feature (admin only)
    {
      id: 'update-feature',
      method: 'PUT',
      path: '/api/features/:id',
      name: 'Update feature',
      description: 'Update an existing feature. Requires admin privileges.',
      auth: 'admin',
      params: [
        { name: 'id', in: 'path', desc: 'Feature ID to update' }
      ],
      body: {
        title: "Updated Feature Title",
        description: "Updated description",
        order: 2,
        is_active: true
      },
      jsExample: `// Update an existing feature (admin only)
const updateFeature = async (id, updates) => {
  try {
    const response = await fetch('${baseUrl}/api/features/' + id, {
      method: 'PUT',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    console.log('Feature updated:', data.data);
    return data;
  } catch (error) {
    console.error('Error updating feature:', error);
  }
};

// Example: Update feature with ID 1
updateFeature(1, {
  title: "Updated Feature Name",
  order: 5,
  is_active: true
});`,
      response: {
        success: true,
        message: "Feature updated successfully",
        data: {
          id: 1,
          title: "Updated Feature Name",
          description: "Updated description",
          order: 5,
          is_active: true,
          updated_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // DELETE feature (admin only)
    {
      id: 'delete-feature',
      method: 'DELETE',
      path: '/api/features/:id',
      name: 'Delete feature',
      description: 'Delete a feature. Requires admin privileges.',
      auth: 'admin',
      params: [
        { name: 'id', in: 'path', desc: 'Feature ID to delete' }
      ],
      jsExample: `// Delete a feature (admin only)
const deleteFeature = async (id) => {
  try {
    const response = await fetch('${baseUrl}/api/features/' + id, {
      method: 'DELETE',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY'
      }
    });
    const data = await response.json();
    console.log('Delete result:', data.message);
    return data;
  } catch (error) {
    console.error('Error deleting feature:', error);
  }
};

// Example: Delete feature with ID 1
deleteFeature(1);`,
      response: {
        success: true,
        message: "Feature deleted successfully"
      }
    },
    
    // CREATE significant (admin only)
    {
      id: 'create-significant',
      method: 'POST',
      path: '/api/significants',
      name: 'Create significant',
      description: 'Create a new significant item. Requires admin privileges.',
      auth: 'admin',
      body: {
        title: "New Significant Item",
        description: "This is a significant achievement",
        image_url: "https://example.com/image.jpg",
        thumbnail_url: "https://example.com/thumb.jpg",
        icon_url: "https://example.com/icon.svg",
        highlight_text: "FEATURED",
        priority: 5
      },
      jsExample: `// Create a new significant item (admin only)
const createSignificant = async (significantData) => {
  try {
    const response = await fetch('${baseUrl}/api/significants', {
      method: 'POST',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(significantData)
    });
    const data = await response.json();
    console.log('Significant created:', data.data);
    return data;
  } catch (error) {
    console.error('Error creating significant:', error);
  }
};

// Example usage
createSignificant({
  title: "Industry Award 2026",
  description: "Recognized as best in class",
  image_url: "https://example.com/award.jpg",
  highlight_text: "WINNER",
  priority: 10
});`,
      response: {
        success: true,
        message: "Significant created successfully",
        data: {
          id: 1,
          title: "Industry Award 2026",
          highlight_text: "WINNER",
          priority: 10,
          is_active: true,
          created_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // UPDATE significant (admin only)
    {
      id: 'update-significant',
      method: 'PUT',
      path: '/api/significants/:id',
      name: 'Update significant',
      description: 'Update an existing significant item. Requires admin privileges.',
      auth: 'admin',
      params: [
        { name: 'id', in: 'path', desc: 'Significant ID to update' }
      ],
      body: {
        title: "Updated Significant Title",
        highlight_text: "UPDATED",
        priority: 8,
        is_active: true
      },
      jsExample: `// Update an existing significant (admin only)
const updateSignificant = async (id, updates) => {
  try {
    const response = await fetch('${baseUrl}/api/significants/' + id, {
      method: 'PUT',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    console.log('Significant updated:', data.data);
    return data;
  } catch (error) {
    console.error('Error updating significant:', error);
  }
};

// Example: Update significant with ID 1
updateSignificant(1, {
  title: "Updated Award Title",
  highlight_text: "GOLD WINNER",
  priority: 10
});`,
      response: {
        success: true,
        message: "Significant updated successfully",
        data: {
          id: 1,
          title: "Updated Award Title",
          highlight_text: "GOLD WINNER",
          priority: 10,
          updated_at: "2026-05-01T12:00:00Z"
        }
      }
    },
    
    // DELETE significant (admin only)
    {
      id: 'delete-significant',
      method: 'DELETE',
      path: '/api/significants/:id',
      name: 'Delete significant',
      description: 'Delete a significant item. Requires admin privileges.',
      auth: 'admin',
      params: [
        { name: 'id', in: 'path', desc: 'Significant ID to delete' }
      ],
      jsExample: `// Delete a significant item (admin only)
const deleteSignificant = async (id) => {
  try {
    const response = await fetch('${baseUrl}/api/significants/' + id, {
      method: 'DELETE',
      headers: {
        'X-Admin-Api-Key': 'YOUR_ADMIN_API_KEY'
      }
    });
    const data = await response.json();
    console.log('Delete result:', data.message);
    return data;
  } catch (error) {
    console.error('Error deleting significant:', error);
  }
};

// Example: Delete significant with ID 1
deleteSignificant(1);`,
      response: {
        success: true,
        message: "Significant deleted successfully"
      }
    }
  ];
  
  res.render('index', {
    serviceName: 'Auth Service',
    baseUrl: baseUrl,
    issuer: process.env.JWT_ISSUER || 'auth-service',
    version: '1.0.0',
    publicEndpoints: publicEndpoints,
    protectedEndpoints: protectedEndpoints,
    adminEndpoints: []
  });
});