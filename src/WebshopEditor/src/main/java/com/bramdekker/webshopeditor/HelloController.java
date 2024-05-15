package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import java.sql.*;


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
            .thenRun(this::importButtonClick)
            .exceptionally(ex -> {
                ex.printStackTrace();
                return null;
            });
    }

    private void updateWelcomeText(Boolean valid) {
        Platform.runLater(() -> welcomeText.setText(valid ? "Database connection is working" : "Database connection is NOT working"));
    }

    @FXML
    protected void importButtonClick() {
        DatabaseService.getInstance()
        .returnConnection()
            .thenAcceptAsync(connection -> {
                try (Statement statement = connection.createStatement();
                     ResultSet resultSet = statement.executeQuery("SELECT * FROM orderitem")) {
                    StringBuilder ordersText = new StringBuilder();
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount();
                    ordersText.append("id,\"name\", \"description\", \"price\"\n");
                    while (resultSet.next()) {
                            System.out.println(columnCount);
                            // Retrieve data from the ResultSet
                            int orderId = resultSet.getInt("id");
                            String orderName = resultSet.getString("name");
                            String orderDescription = resultSet.getString("description");
                            float orderPrice = resultSet.getFloat("price");

                        // Append the details of the current row to the StringBuilder
                        ordersText.append(orderId)
                            .append(",")
                            .append("\"").append(orderName).append("\"") // Surround orderName with double quotes
                            .append(",")
                            .append("\"").append(orderDescription).append("\"")
                            .append(",")
                            .append("\"").append(orderPrice).append("\"")
                            .append("\n");

                    }
                    Platform.runLater(() -> textarea_text.setText(ordersText.toString()));
                } catch (SQLException e) {
                    e.printStackTrace();
                    // Handle SQLException appropriately
                }
            });
                }
            }

