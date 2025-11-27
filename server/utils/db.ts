import duckdb from 'duckdb'

let db: duckdb.Database | null = null

export function getDB() {
  if (!db) {
    db = new duckdb.Database('./data/tracker.duckdb', (err) => {
      if (err) {
        console.error('❌ Database creation failed:', err)
        throw err
      }
      console.log('✅ Database connected')
    })

    const conn = db.connect()

    // Events table - stores all tracked events
    conn.run(
      `
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL,
        session_id VARCHAR NOT NULL,
        user_id VARCHAR,
        event_type VARCHAR NOT NULL,
        event_subtype VARCHAR,
        timestamp TIMESTAMP NOT NULL,
        
        -- Error fields
        error_message VARCHAR,
        error_stack TEXT,
        error_filename VARCHAR,
        error_line INTEGER,
        error_column INTEGER,
        
        -- Performance fields
        perf_value DOUBLE,
        perf_rating VARCHAR,
        
        -- Custom event fields
        custom_name VARCHAR,
        custom_payload JSON,
        
        -- Context
        url VARCHAR NOT NULL,
        referrer VARCHAR,
        browser VARCHAR,
        os VARCHAR,
        viewport_width INTEGER,
        viewport_height INTEGER,
        sdk_version VARCHAR,
        
        -- Metadata
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
      (err) => {
        if (err) {
          console.error('❌ Events table creation failed:', err)
        } else {
          console.log('✅ Events table ready')

          // Create indexes
          conn.run(
            `
            CREATE INDEX IF NOT EXISTS idx_project_time ON events(project_id, timestamp DESC);
            CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type, event_subtype);
            CREATE INDEX IF NOT EXISTS idx_session ON events(session_id);
            CREATE INDEX IF NOT EXISTS idx_user ON events(user_id);
            CREATE INDEX IF NOT EXISTS idx_error_type ON events(event_type) WHERE event_type IN ('error', 'unhandled_rejection', 'console_error');
          `,
            (err) => {
              if (err) console.error('❌ Index creation failed:', err)
              else console.log('✅ Indexes created')
            }
          )
        }
      }
    )

    // Sessions table - aggregate session data
    conn.run(
      `
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL,
        user_id VARCHAR,
        first_seen TIMESTAMP NOT NULL,
        last_seen TIMESTAMP NOT NULL,
        page_count INTEGER DEFAULT 1,
        error_count INTEGER DEFAULT 0,
        event_count INTEGER DEFAULT 0,
        browser VARCHAR,
        os VARCHAR,
        referrer VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
      (err) => {
        if (err) {
          console.error('❌ Sessions table creation failed:', err)
        } else {
          console.log('✅ Sessions table ready')

          conn.run(
            `
            CREATE INDEX IF NOT EXISTS idx_session_project ON sessions(project_id);
            CREATE INDEX IF NOT EXISTS idx_session_user ON sessions(user_id);
            CREATE INDEX IF NOT EXISTS idx_session_time ON sessions(last_seen DESC);
          `,
            (err) => {
              if (err) console.error('❌ Session indexes failed:', err)
              else console.log('✅ Session indexes created')
              conn.close()
            }
          )
        }
      }
    )
  }

  return db
}

// Query helpers
export function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDB()
  const conn = db.connect()

  return new Promise((resolve, reject) => {
    conn.all(sql, ...params, (err: Error, rows: any[]) => {
      conn.close()
      if (err) reject(err)
      else resolve(rows as T[])
    })
  })
}

export function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  return query<T>(sql, params).then(rows => rows[0] || null)
}

export function execute(sql: string, params: any[] = []): Promise<void> {
  const db = getDB()
  const conn = db.connect()

  return new Promise((resolve, reject) => {
    conn.run(sql, ...params, (err: Error) => {
      conn.close()
      if (err) reject(err)
      else resolve()
    })
  })
}

// Batch insert helper for better performance
export function batchInsert(table: string, columns: string[], rows: any[][]): Promise<void> {
  if (rows.length === 0) return Promise.resolve()

  const placeholders = columns.map(() => '?').join(', ')
  const values = rows.map(() => `(${placeholders})`).join(', ')
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${values}`
  const flatParams = rows.flat()

  return execute(sql, flatParams)
}