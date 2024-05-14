package com.bramdekker.webshopeditor.services;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseService {
    private static Dotenv dotenv;
    private static DatabaseService databaseService;

    private DatabaseService() {
        dotenv = Dotenv.configure().load();
    }

    public static DatabaseService getInstance() {
        if(databaseService == null) {
            databaseService = new DatabaseService();
        }
        return databaseService;
    }

    public Connection returnConnection() {
        String hostname = dotenv.get("DATABASE_HOST");
        int port = Integer.parseInt(dotenv.get("DATABASE_PORT"));
        String username = dotenv.get("DATABASE_USER");
        String password = dotenv.get("DATABASE_PASSWORD");
        String database = dotenv.get("DATABASE_NAME");

        String url = "jdbc:mysql://" + hostname + ":" + port + "/" + database + "?autoReconnect=true&useSSL=false";

        try {
            return DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            throw new RuntimeException("Error connecting to the database", e);
        }
    }
}
