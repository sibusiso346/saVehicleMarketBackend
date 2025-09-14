const pool = require('../config/database');

class Vehicle {
  constructor(data) {
    this.id = data.id;
    this.vehicle_title = data.vehicle_title;
    this.category = data.category;
    this.brand = data.brand;
    this.model = data.model;
    this.year = data.year;
    this.price = data.price;
    this.condition = data.condition;
    this.mileage = data.mileage;
    this.fuel_type = data.fuel_type;
    this.transmission = data.transmission;
    this.engine = data.engine;
    this.color = data.color;
    this.body = data.body;
    this.reference = data.reference;
    this.date_added = data.date_added;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new vehicle
  static async create(vehicleData) {
    const {
      vehicle_title,
      category,
      brand,
      model,
      year,
      price,
      condition,
      mileage,
      fuel_type,
      transmission,
      engine,
      color,
      body,
      reference
    } = vehicleData;
    
    const query = `
      INSERT INTO vehicles (
        vehicle_title, category, brand, model, year, price, condition,
        mileage, fuel_type, transmission, engine, color, body, reference, date_added
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const values = [
      vehicle_title, category, brand, model, year, price, condition,
      mileage, fuel_type, transmission, engine, color, body, reference
    ];
    
    const result = await pool.query(query, values);
    return new Vehicle(result.rows[0]);
  }

  // Find vehicle by ID
  static async findById(id) {
    const query = 'SELECT * FROM vehicles WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Vehicle(result.rows[0]);
  }

  // Find vehicles by brand
  static async findByBrand(brand) {
    const query = 'SELECT * FROM vehicles WHERE brand ILIKE $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [`%${brand}%`]);
    return result.rows.map(row => new Vehicle(row));
  }

  // Find vehicles by category
  static async findByCategory(category) {
    const query = 'SELECT * FROM vehicles WHERE category ILIKE $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [`%${category}%`]);
    return result.rows.map(row => new Vehicle(row));
  }

  // Find vehicles by price range
  static async findByPriceRange(minPrice, maxPrice) {
    const query = 'SELECT * FROM vehicles WHERE price BETWEEN $1 AND $2 ORDER BY price ASC';
    const result = await pool.query(query, [minPrice, maxPrice]);
    return result.rows.map(row => new Vehicle(row));
  }

  // Find vehicles by year range
  static async findByYearRange(minYear, maxYear) {
    const query = 'SELECT * FROM vehicles WHERE year BETWEEN $1 AND $2 ORDER BY year DESC';
    const result = await pool.query(query, [minYear, maxYear]);
    return result.rows.map(row => new Vehicle(row));
  }

  // Search vehicles by multiple criteria
  static async search(searchCriteria) {
    const {
      brand,
      category,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel_type,
      transmission,
      condition,
      limit = 20,
      offset = 0
    } = searchCriteria;

    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (brand) {
      query += ` AND brand ILIKE $${paramCount}`;
      values.push(`%${brand}%`);
      paramCount++;
    }

    if (category) {
      query += ` AND category ILIKE $${paramCount}`;
      values.push(`%${category}%`);
      paramCount++;
    }

    if (minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(maxPrice);
      paramCount++;
    }

    if (minYear !== undefined) {
      query += ` AND year >= $${paramCount}`;
      values.push(minYear);
      paramCount++;
    }

    if (maxYear !== undefined) {
      query += ` AND year <= $${paramCount}`;
      values.push(maxYear);
      paramCount++;
    }

    if (fuel_type) {
      query += ` AND fuel_type ILIKE $${paramCount}`;
      values.push(`%${fuel_type}%`);
      paramCount++;
    }

    if (transmission) {
      query += ` AND transmission ILIKE $${paramCount}`;
      values.push(`%${transmission}%`);
      paramCount++;
    }

    if (condition) {
      query += ` AND condition ILIKE $${paramCount}`;
      values.push(`%${condition}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows.map(row => new Vehicle(row));
  }

  // Get all vehicles with pagination
  static async findAll(limit = 20, offset = 0) {
    const query = `
      SELECT * FROM vehicles 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows.map(row => new Vehicle(row));
  }

  // Update vehicle
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE vehicles 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Vehicle(result.rows[0]);
  }

  // Delete vehicle
  static async delete(id) {
    const query = 'DELETE FROM vehicles WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    return result.rows.length > 0;
  }

  // Get vehicle count for pagination
  static async count(searchCriteria = {}) {
    const {
      brand,
      category,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel_type,
      transmission,
      condition
    } = searchCriteria;

    let query = 'SELECT COUNT(*) FROM vehicles WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (brand) {
      query += ` AND brand ILIKE $${paramCount}`;
      values.push(`%${brand}%`);
      paramCount++;
    }

    if (category) {
      query += ` AND category ILIKE $${paramCount}`;
      values.push(`%${category}%`);
      paramCount++;
    }

    if (minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(maxPrice);
      paramCount++;
    }

    if (minYear !== undefined) {
      query += ` AND year >= $${paramCount}`;
      values.push(minYear);
      paramCount++;
    }

    if (maxYear !== undefined) {
      query += ` AND year <= $${paramCount}`;
      values.push(maxYear);
      paramCount++;
    }

    if (fuel_type) {
      query += ` AND fuel_type ILIKE $${paramCount}`;
      values.push(`%${fuel_type}%`);
      paramCount++;
    }

    if (transmission) {
      query += ` AND transmission ILIKE $${paramCount}`;
      values.push(`%${transmission}%`);
      paramCount++;
    }

    if (condition) {
      query += ` AND condition ILIKE $${paramCount}`;
      values.push(`%${condition}%`);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      vehicle_title: this.vehicle_title,
      category: this.category,
      brand: this.brand,
      model: this.model,
      year: this.year,
      price: this.price,
      condition: this.condition,
      mileage: this.mileage,
      fuel_type: this.fuel_type,
      transmission: this.transmission,
      engine: this.engine,
      color: this.color,
      body: this.body,
      reference: this.reference,
      date_added: this.date_added,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Vehicle;
