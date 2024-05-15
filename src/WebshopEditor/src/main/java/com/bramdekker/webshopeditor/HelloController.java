package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    private TextArea textarea_text;

    @FXML
    private Button button_import;

    @FXML
    private Button button_export;

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
                    if (connection == null) return false;
                    boolean isValidConnection = connection.isValid(2);
                    connection.close();
                    return isValidConnection;
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            })
            .thenAcceptAsync(this::updateWelcomeText)
            .thenRun(this::selectDataFromOrderItem)
            .exceptionally(ex -> {
                ex.printStackTrace();
                return null;
            });
    }

    private void updateWelcomeText(Boolean valid) {
        Platform.runLater(() -> welcomeText.setText(valid ? "Database connection is working" : "Database connection is NOT working"));
    }

    private void selectDataFromOrderItem() {
        DatabaseService.getInstance()
        .returnConnection()
            .thenAcceptAsync(connection -> {
                try (Statement statement = connection.createStatement();
                     ResultSet resultSet = statement.executeQuery("SELECT * FROM orderitem")) {
                    while (resultSet.next()) {
                        // Retrieve data from the ResultSet
                        int orderId = resultSet.getInt("id");
                        var orderName = resultSet.getString("name");
                        var orderDescription = resultSet.getString("description");
                        float orderPrice = resultSet.getFloat("price");

                        // Retrieve other columns similarly

                        // Process or print the retrieved data
                        textarea_text.setText("Order id: " + orderId + ". Order name: " + orderName + ". Order description: " + orderDescription + ". Order Price: $" + orderPrice + ",");
                        // Print or process other columns similarly
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    // Handle SQLException appropriately
                }
            });
                }
            }

