package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;

import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Label;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.CompletableFuture;

public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Checking database connection...");

        checkDatabaseConnection();
    }

    private void checkDatabaseConnection() {
        CompletableFuture<Connection> future = DatabaseService.getInstance().returnConnection();

        future.thenAccept(this::updateWelcomeText).exceptionally(ex -> {
            ex.printStackTrace();
            return null;
        });
    }

    private void updateWelcomeText(Connection connection) {
        Platform.runLater(() -> {
            try {
                welcomeText.setText(connection.isValid(2) ? "Database connection is working" : "Database connection is NOT working");
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        });
    }
}