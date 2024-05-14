package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Label;

import java.sql.SQLException;

public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Checking database connection...");

        checkDatabaseConnection();
    }

    private void checkDatabaseConnection() {
        DatabaseService.getInstance()
            .returnConnection()
            .thenApplyAsync(connection -> {
                try {
                    return connection.isValid(2);
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            })
            .thenAcceptAsync(this::updateWelcomeText)
            .exceptionally(ex -> {
                ex.printStackTrace();
                return null;
            });
    }

    private void updateWelcomeText(Boolean valid) {
        Platform.runLater(() -> welcomeText.setText(valid ? "Database connection is working" : "Database connection is NOT working"));
    }
}