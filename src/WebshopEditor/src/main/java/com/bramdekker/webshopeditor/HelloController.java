package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import java.io.*;
import java.sql.*;


@SuppressWarnings("ALL")
public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    private Label exportSuccess;

    @FXML
    private Label csvSuccess;

    @FXML
    private TextArea textarea_text;

    @FXML
    private Button button_import;

    @FXML
    private Button convertToCsv;

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
            .exceptionally(ex -> {
                ex.printStackTrace();
                return null;
            });
    }

    private void updateWelcomeText(Boolean valid) {
        Platform.runLater(() -> welcomeText.setText(valid ? "Database connection is working" : "Database connection is NOT working"));
    }

    @FXML
    protected void exportButtonClick() {
        // path gelijk maken aan de file
        String filePath = "orderitem_import.csv";

        // leest de csv file en update of insert het in de database
        try {
            File csvFile = new File(filePath);
            DatabaseService.getInstance().returnConnection().thenAcceptAsync(connection -> {
                try (PreparedStatement preparedStatement = connection.prepareStatement(
                    "INSERT INTO orderitem (id, name, description, price, imageURLs, orderId) VALUES (?, ?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE " +
                        "name = VALUES(name), description = VALUES(description), " +
                        "price = VALUES(price), imageURLs = VALUES(imageURLs), " +
                        "orderId = VALUES(orderId)")) {
                    try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            // Split de csv bij de komma's
                            String[] values = line.split(",");

                            // sommige punten forced op null zetten
                            for (int i = 0; i < values.length; i++) {
                                if (values[i].equalsIgnoreCase("NULL")) {
                                    preparedStatement.setNull(i + 1, Types.VARCHAR); // Set null for VARCHAR column
                                } else {
                                    preparedStatement.setString(i + 1, values[i]);
                                }
                            }

                            // update en insert statement uitvoeren en label updaten met tekst
                            preparedStatement.executeUpdate();
                            Platform.runLater(() -> exportSuccess.setText("export to database was successful"));
                        }
                        // Show success message or update UI if needed
                    } catch (IOException | SQLException e) {
                        e.printStackTrace();
                        // Handle exceptions
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    // Handle exceptions
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions
        }
    }


    @FXML
    protected void convertToCsvClick() {
        //haal de text op uit de textarea
        StringBuilder csvData = new StringBuilder();
        csvData.append(textarea_text.getText());

        // Schrijf de CSV-geformatteerde string naar een CSV-bestand
        try (PrintWriter writer = new PrintWriter("orderitem_import.csv")) {
            writer.write(csvData.toString());
            Platform.runLater(() -> csvSuccess.setText("export to CSV was successful"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            // Behandel de uitzondering als het bestand niet gevonden is
        }
    }

    @FXML
    protected void importButtonClick() {
        DatabaseService.getInstance()
            .returnConnection()
            .thenAcceptAsync(connection -> {
                try (Statement statement = connection.createStatement();
                     ResultSet resultSet = statement.executeQuery("SELECT * FROM orderitem")) {

                    // Bouw een StringBuilder op om de CSV-geformatteerde gegevens op te slaan
                    StringBuilder csvData = new StringBuilder();
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    // Schrijf de gegevensrijen naar de CSV-geformatteerde string
                    while (resultSet.next()) {
                        for (int i = 1; i <= columnCount; i++) {
                            String value = resultSet.getString(i);
                            if (value != null) {
                                value = value.toUpperCase(); // Convert non-null value to uppercase
                            } else {
                                value = "NULL"; // Convert null value to "NULL" string (uppercase)
                            }
                            csvData.append("").append(value).append("");
                            if (i < columnCount) {
                                csvData.append(",");
                            }
                        }
                        csvData.append("\n");
                    }
                    // Toon een succesbericht of werk de UI bij indien nodig
                    Platform.runLater(() -> {
                        // Werk de UI bij of toon een succesbericht
                        String text = csvData.toString();
                        textarea_text.setText(text);
                    });
                } catch (SQLException e) {
                    e.printStackTrace();
                    // Behandel de SQLException op de juiste manier
                }
            });
    }
}
