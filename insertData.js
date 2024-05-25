const sqlite3 = require('sqlite3').verbose();
const data = require('./merged.json');

const db = new sqlite3.Database('./university.db');

db.serialize(async function() {
  // Crearea tabelelor conform schemei din db_licenta.db
  db.run(`
    CREATE TABLE IF NOT EXISTS regions (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      id_regiune INTEGER REFERENCES regions (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS universities (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      statut VARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS faculties (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      link VARCHAR(255),
      taxa_anuala REAL,
      id_universitate INTEGER REFERENCES universities (id),
      id_oras INTEGER REFERENCES cities (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS domains (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS branchOfSciences (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      id_domeniu INTEGER REFERENCES domains (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS specializations (
      id INTEGER PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      numar_locuri_buget INTEGER,
      numar_locuri_taxa INTEGER,
      ultima_medie_buget REAL,
      ultima_medie_taxa REAL,
      id_facultate INTEGER REFERENCES faculties (id),
      id_ramura INTEGER REFERENCES branchOfSciences (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID NOT NULL UNIQUE PRIMARY KEY,
      nume VARCHAR(255) NOT NULL,
      prenume VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE,
      quizResult VARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY,
      continut VARCHAR(255) NOT NULL,
      data VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      id_specializare INTEGER REFERENCES specializations (id),
      parinte INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS userTypes (
      id INTEGER PRIMARY KEY,
      tip_utilizator TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS branchesDomains (
      nume TEXT,
      domeniu TEXT,
      id_b INT,
      id_d INT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS citiesRegions (
      nume TEXT,
      regiune TEXT,
      id_c INT,
      id_r INT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS facultiesUniversities (
      nume TEXT,
      universitate TEXT,
      id_f INT,
      id_u INT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS specializationsTotals (
      id INTEGER PRIMARY KEY,
      id_s INTEGER,
      id_f INTEGER,
      id_u INTEGER,
      id_ra INTEGER,
      id_d INTEGER,
      id_re INTEGER,
      id_o INTEGER,
      specializare TEXT,
      facultate TEXT,
      universitate TEXT,
      numar_locuri_buget INTEGER,
      numar_locuri_taxa INTEGER,
      ultima_medie_buget REAL,
      ultima_medie_taxa REAL,
      taxa_anuala REAL,
      link TEXT,
      statut TEXT,
      ramura TEXT,
      domeniu TEXT,
      oras TEXT,
      regiune TEXT
    )
  `);

  // Inserarea datelor în tabelele regions și cities
  const regions = [
    [1, 'Banat'],
    [2, 'Crișana și Maramureș'],
    [3, 'Dobrogea'],
    [4, 'Moldova'],
    [5, 'Muntenia'],
    [6, 'Oltenia'],
    [7, 'Transilvania']
  ];

  const cities = [
    [1, 'Alba Iulia', 7],
    [2, 'Arad', 2],
    [3, 'Bacău', 4],
    [4, 'Baia Mare', 2],
    [5, 'Brașov', 7],
    [6, 'București', 5],
    [7, 'Cluj-Napoca', 7],
    [8, 'Constanța', 3],
    [9, 'Craiova', 6],
    [10, 'Deva', 7],
    [11, 'Galați', 4],
    [12, 'Iași', 4],
    [13, 'Lugoj', 1],
    [14, 'Oradea', 2],
    [15, 'Petroșani', 7],
    [16, 'Pitești', 5],
    [17, 'Ploiești', 5],
    [18, 'Reșița', 1],
    [19, 'Roman', 4],
    [20, 'Satu-Mare', 2],
    [21, 'Sibiu', 7],
    [22, 'Suceava', 4],
    [23, 'Târgoviște', 5],
    [24, 'Târgu-Jiu', 6],
    [25, 'Târgu-Mureș', 7],
    [26, 'Timișoara', 1],
    [27, 'Cernica', 5],
    [28, 'Miercurea Ciuc', 7],
    [29, 'Brăila', 5],
    [30, 'Râmnicu Vâlcea', 6],
    [31, 'Câmpulung', 5],
    [32, 'Alexandria', 5],
    [33, 'Hunedoara', 7]
  ];

  // Inserare regiuni
  regions.forEach(region => {
    db.run('INSERT INTO regions (id, nume) VALUES (?, ?)', region, function(err) {
      if (err) {
        console.error(err.message);
      }
    });
  });

  // Inserare orașe
  cities.forEach(city => {
    db.run('INSERT INTO cities (id, nume, id_regiune) VALUES (?, ?, ?)', city, function(err) {
      if (err) {
        console.error(err.message);
      }
    });
  });

  for (let item of data) {
    // Verifică dacă universitatea există
    let universityId;
    await new Promise((resolve, reject) => {
      db.get('SELECT id FROM universities WHERE nume = ?', [item.universitate], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          universityId = row.id;
          resolve();
        } else {
          db.run('INSERT INTO universities (nume, statut) VALUES (?, ?)', [item.universitate, item.acreditare], function(err) {
            if (err) {
              reject(err);
            } else {
              universityId = this.lastID;
              resolve();
            }
          });
        }
      });
    });

    // Determinarea cityId pe baza numelui facultății sau universității
    let cityId = null;
    await new Promise((resolve, reject) => {
      db.all('SELECT id, nume FROM cities', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
            for (let city of rows) {
                if (item.facultate.toLocaleLowerCase().replace('-', ' ').replace('–', ' ').replace('-', ' ')
                .replace(/ă/g, 'a')
                .replace(/â/g, 'a')
                .replace(/î/g, 'i')
                .replace(/ș/g, 's')
                .replace(/ş/g, 's')
                .replace(/ț/g, 't')
                .replace(/ţ/g, 't').includes(city.nume.toLocaleLowerCase().replace('-', ' ').replace('–', ' ').replace('-', ' ')
                .replace(/ă/g, 'a')
                .replace(/â/g, 'a')
                .replace(/î/g, 'i')
                .replace(/ș/g, 's')
                .replace(/ş/g, 's')
                .replace(/ț/g, 't')
                .replace(/ţ/g, 't'))){
                    cityId = city.id;
                    break;
                }else if(item.universitate.toLocaleLowerCase().replace('-', ' ').replace('–', ' ').replace('-', ' ')
                .replace(/ă/g, 'a')
                .replace(/â/g, 'a')
                .replace(/î/g, 'i')
                .replace(/ș/g, 's')
                .replace(/ş/g, 's')
                .replace(/ț/g, 't')
                .replace(/ţ/g, 't').includes(city.nume.toLocaleLowerCase().replace('-', ' ').replace('–', ' ').replace('-', ' ')
                .replace(/ă/g, 'a')
                .replace(/â/g, 'a')
                .replace(/î/g, 'i')
                .replace(/ș/g, 's')
                .replace(/ş/g, 's')
                .replace(/ț/g, 't')
                .replace(/ţ/g, 't'))) {
                    cityId = city.id;
                    break;
                }
              }
          resolve();
        }
      });
    });

    // Verifică dacă facultatea există
    let facultyId;
    await new Promise((resolve, reject) => {
      db.get('SELECT id FROM faculties WHERE nume = ? AND id_universitate = ?', [item.facultate, universityId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          facultyId = row.id;
          resolve();
        } else {
          db.run('INSERT INTO faculties (nume, id_universitate, id_oras) VALUES (?, ?, ?)', [item.facultate, universityId, cityId], function(err) {
            if (err) {
              reject(err);
            } else {
              facultyId = this.lastID;
              resolve();
            }
          });
        }
      });
    });

    // Verifică dacă domeniul fundamental există
    let domainId;
    await new Promise((resolve, reject) => {
      db.get('SELECT id FROM domains WHERE nume = ?', [item.domeniulFundamental], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          domainId = row.id;
          resolve();
        } else {
          db.run('INSERT INTO domains (nume) VALUES (?)', [item.domeniulFundamental], function(err) {
            if (err) {
              reject(err);
            } else {
              domainId = this.lastID;
              resolve();
            }
          });
        }
      });
    });

    // Verifică dacă ramura de știință există
    let branchId;
    await new Promise((resolve, reject) => {
      db.get('SELECT id FROM branchOfSciences WHERE nume = ? AND id_domeniu = ?', [item.ramura, domainId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          branchId = row.id;
          resolve();
        } else {
          db.run('INSERT INTO branchOfSciences (nume, id_domeniu) VALUES (?, ?)', [item.ramura, domainId], function(err) {
            if (err) {
              reject(err);
            } else {
              branchId = this.lastID;
              resolve();
            }
          });
        }
      });
    });

    // Verifică dacă specializarea există
    await new Promise((resolve, reject) => {
      db.get('SELECT id FROM specializations WHERE nume = ? AND id_facultate = ? AND id_ramura = ?', [item.specializare, facultyId, branchId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve();
        } else {
          db.run(
            'INSERT INTO specializations (nume, id_facultate, id_ramura, numar_locuri_buget, numar_locuri_taxa, ultima_medie_buget, ultima_medie_taxa) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [item.specializare, facultyId, branchId, item.numar_locuri_buget, item.numar_locuri_taxa, item.ultima_medie_buget, item.ultima_medie_taxa],
            function(err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        }
      });
    });

    // // Inserare în specializationsTotals
    // await new Promise((resolve, reject) => {
    //   db.run(
    //     'INSERT INTO specializationsTotals (id_s, id_f, id_u, id_ra, id_d, id_re, id_o, specializare, facultate, universitate, numar_locuri_buget, numar_locuri_taxa, ultima_medie_buget, ultima_medie_taxa, taxa_anuala, link, statut, ramura, domeniu, oras, regiune) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //     [
    //       item.id_specializare, facultyId, universityId, branchId, domainId, item.id_regiune, cityId,
    //       item.specializare, item.facultate, item.universitate, item.numar_locuri_buget, item.numar_locuri_taxa, item.ultima_medie_buget, item.ultima_medie_taxa,
    //       item.taxa_anuala, item.link, item.acreditare, item.ramura, item.domeniu, item.oras, item.regiune
    //     ],
    //     function(err) {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve();
    //       }
    //     }
    //   );
    // });

    // Inserare în branchesDomains
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO branchesDomains (nume, domeniu, id_b, id_d) VALUES (?, ?, ?, ?)',
        [item.ramura, item.domeniu, branchId, domainId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    // // Inserare în citiesRegions
    // await new Promise((resolve, reject) => {
    //   db.run(
    //     'INSERT INTO citiesRegions (nume, regiune, id_c, id_r) VALUES (?, ?, ?, ?)',
    //     [item.oras, item.regiune, cityId, item.id_regiune],
    //     function(err) {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve();
    //       }
    //     }
    //   );
    // });

    // Inserare în facultiesUniversities
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO facultiesUniversities (nume, universitate, id_f, id_u) VALUES (?, ?, ?, ?)',
        [item.facultate, item.universitate, facultyId, universityId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

    // Inserare în `citiesRegions`
    db.all('SELECT cities.id AS cityId, cities.nume AS cityName, regions.id AS regionId, regions.nume AS regionName FROM cities INNER JOIN regions ON cities.id_regiune = regions.id', [], (err, rows) => {
        if (err) {
          console.error(err.message);
          return;
        }
        rows.forEach((row) => {
          db.run(
            'INSERT INTO citiesRegions (nume, regiune, id_c, id_r) VALUES (?, ?, ?, ?)',
            [row.cityName, row.regionName, row.cityId, row.regionId],
            function(err) {
              if (err) {
                console.error(err.message);
              }
            }
          );
        });
      });
    
      // Inserare în `specializationsTotals`
      db.all(`
        SELECT 
          specializations.id AS specializationId, specializations.nume AS specializationName, specializations.numar_locuri_buget, specializations.numar_locuri_taxa, specializations.ultima_medie_buget, specializations.ultima_medie_taxa, 
          faculties.id AS facultyId, faculties.nume AS facultyName, faculties.taxa_anuala, faculties.link, 
          universities.id AS universityId, universities.nume AS universityName, universities.statut,
          branchOfSciences.id AS branchId, branchOfSciences.nume AS branchName,
          domains.id AS domainId, domains.nume AS domainName,
          cities.id AS cityId, cities.nume AS cityName, 
          regions.id AS regionId, regions.nume AS regionName
        FROM specializations
        INNER JOIN faculties ON specializations.id_facultate = faculties.id
        INNER JOIN universities ON faculties.id_universitate = universities.id
        INNER JOIN branchOfSciences ON specializations.id_ramura = branchOfSciences.id
        INNER JOIN domains ON branchOfSciences.id_domeniu = domains.id
        INNER JOIN cities ON faculties.id_oras = cities.id
        INNER JOIN regions ON cities.id_regiune = regions.id
      `, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          return;
        }
        rows.forEach((row) => {
          db.run(
            'INSERT INTO specializationsTotals (id_s, id_f, id_u, id_ra, id_d, id_re, id_o, specializare, facultate, universitate, numar_locuri_buget, numar_locuri_taxa, ultima_medie_buget, ultima_medie_taxa, taxa_anuala, link, statut, ramura, domeniu, oras, regiune) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              row.specializationId, row.facultyId, row.universityId, row.branchId, row.domainId, row.regionId, row.cityId,
              row.specializationName, row.facultyName, row.universityName, row.numar_locuri_buget, row.numar_locuri_taxa, row.ultima_medie_buget, row.ultima_medie_taxa,
              row.taxa_anuala, row.link, row.statut, row.branchName, row.domainName, row.cityName, row.regionName
            ],
            function(err) {
              if (err) {
                console.error(err.message);
              }
            }
          );
        });
      });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
  });
});
