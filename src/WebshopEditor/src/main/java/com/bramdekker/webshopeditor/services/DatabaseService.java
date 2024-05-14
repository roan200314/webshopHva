package com.bramdekker.webshopeditor.services;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.CompletableFuture;

public class DatabaseService {
    private static Dotenv dotenv;
    private static DatabaseService databaseService;

    private DatabaseService() {
        dotenv = Dotenv.configure().load();
    }

    public static DatabaseService getInstance() {
        if (databaseService == null) {
            databaseService = new DatabaseService();
        }
        return databaseService;
    }

    public CompletableFuture<Connection> returnConnection() {
        return CompletableFuture.supplyAsync(() -> {
            String hostname = dotenv.get("DATABASE_HOST");
            int port = Integer.parseInt(dotenv.get("DATABASE_PORT"));
            String username = dotenv.get("DATABASE_USER");
            String password = dotenv.get("DATABASE_PASSWORD");
            String database = dotenv.get("DATABASE_NAME");

            String url = "jdbc:mysql://" + hostname + ":" + port + "/" + database + "?autoReconnect=true&useSSL=false";

            try {
                return DriverManager.getConnection(url, username, password);
            } catch (SQLException e) {
                e.printStackTrace();
                return null;
            }
        });
    }
}
