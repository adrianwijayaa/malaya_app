"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ========== Cek kolom yang ada sebelum hapus ==========
    const tripsColumns = await queryInterface.describeTable("Trips");
    const joinTripsColumns = await queryInterface.describeTable("JoinTrips");

    // ========== UPDATE TRIPS (Tailormade) ==========
    // Hapus date hanya jika ada
    if (tripsColumns.date) {
      await queryInterface.removeColumn("Trips", "date");
    }

    // Tambah startDate & endDate jika belum ada
    if (!tripsColumns.startDate) {
      await queryInterface.addColumn("Trips", "startDate", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    if (!tripsColumns.endDate) {
      await queryInterface.addColumn("Trips", "endDate", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    if (!tripsColumns.detailPrice) {
      await queryInterface.addColumn("Trips", "detailPrice", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // ========== UPDATE JOINTRIPS ==========
    // Hapus date hanya jika ada (JoinTrips punya kolom date)
    if (joinTripsColumns.date) {
      await queryInterface.removeColumn("JoinTrips", "date");
    }

    // Tambah startDate & endDate jika belum ada
    if (!joinTripsColumns.startDate) {
      await queryInterface.addColumn("JoinTrips", "startDate", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    if (!joinTripsColumns.endDate) {
      await queryInterface.addColumn("JoinTrips", "endDate", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
    if (!joinTripsColumns.detailPrice) {
      await queryInterface.addColumn("JoinTrips", "detailPrice", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // ========== UPDATE INCLUDES (Hapus description) ==========
    const tripIncludesColumns = await queryInterface.describeTable(
      "TripIncludes"
    );
    const joinTripIncludesColumns = await queryInterface.describeTable(
      "JoinTripIncludes"
    );

    if (tripIncludesColumns.description) {
      await queryInterface.removeColumn("TripIncludes", "description");
    }
    if (joinTripIncludesColumns.description) {
      await queryInterface.removeColumn("JoinTripIncludes", "description");
    }

    // ========== CREATE EXCLUDES TABLES ==========
    // Cek apakah tabel sudah ada
    const tables = await queryInterface.showAllTables();

    if (!tables.includes("TripExcludes")) {
      await queryInterface.createTable("TripExcludes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        TripID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "Trips", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        label: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sortOrder: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    }

    if (!tables.includes("JoinTripExcludes")) {
      await queryInterface.createTable("JoinTripExcludes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        JoinTripID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "JoinTrips", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        label: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sortOrder: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Rollback: hapus tabel excludes
    await queryInterface.dropTable("JoinTripExcludes");
    await queryInterface.dropTable("TripExcludes");

    // Kembalikan description di includes
    await queryInterface.addColumn("TripIncludes", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("JoinTripIncludes", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Kembalikan date, hapus startDate/endDate/detailPrice
    await queryInterface.removeColumn("Trips", "startDate");
    await queryInterface.removeColumn("Trips", "endDate");
    await queryInterface.removeColumn("Trips", "detailPrice");
    await queryInterface.addColumn("Trips", "date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.removeColumn("JoinTrips", "startDate");
    await queryInterface.removeColumn("JoinTrips", "endDate");
    await queryInterface.removeColumn("JoinTrips", "detailPrice");
    await queryInterface.addColumn("JoinTrips", "date", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
