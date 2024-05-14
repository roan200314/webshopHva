package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.control.Label;

import java.sql.Connection;
import java.sql.SQLException;

public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Checking database connection...");

        runDatabaseConnectionTask();
    }

    private void runDatabaseConnectionTask() {
        Task<Connection> connectionTask = new Task<>() {
            @Override
            protected Connection call() {
                return DatabaseService.getInstance().returnConnection();
            }
        };

        new Thread(connectionTask).start();

        connectionTask.setOnSucceeded(workerStateEvent -> updateWelcomeTextBasedOnConnectionValidity(connectionTask.getValue()));
        connectionTask.setOnFailed(workerStateEvent -> showDatabaseConnectionFailedMessage());
    }

    private void updateWelcomeTextBasedOnConnectionValidity(Connection connection) {
        try {
            welcomeText.setText(isConnectionValid(connection) ? "Database connection is working" : "Database connection is NOT working");
        } catch (SQLException ex) {
            showDatabaseConnectionFailedMessage();
            ex.printStackTrace();
        }
    }

    private boolean isConnectionValid(Connection connection) throws SQLException {
        return connection.isValid(2);
    }

    private void showDatabaseConnectionFailedMessage() {
        welcomeText.setText("Exception occurred: Database connection is NOT working");
    }
}