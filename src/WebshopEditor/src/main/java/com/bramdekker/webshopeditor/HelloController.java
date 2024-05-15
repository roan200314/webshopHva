package com.bramdekker.webshopeditor;

import com.bramdekker.webshopeditor.services.DatabaseService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import java.io.*;
import java.sql.*;
import java.util.concurrent.ExecutionException;


@SuppressWarnings("ALL")
public class HelloController {
    @FXML
    private Label welcomeText;

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
    protected void exportButtonClick() {
//        // Path to the CSV file to be exported
//        String csvFilePath = "../orderitem_export.csv";
//
//        try {
//            Connection connection = DatabaseService.getInstance().returnConnection().get();
//            try (BufferedReader reader = new BufferedReader(new FileReader(csvFilePath))) {
//                // Read the CSV file
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    // Split the line into individual values
//                    String[] values = line.split(",");
//
//                    // Insert the values into the database
//                    try (PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO orderitem (id, name, description, price) VALUES (?, ?, ?, ?)")) {
//                        preparedStatement.setInt(1, Integer.parseInt(values[0].trim()));
//                        preparedStatement.setString(2, values[1].trim());
//                        preparedStatement.setString(3, values[2].trim());
//                        preparedStatement.setFloat(4, Float.parseFloat(values[3].trim()));
//
//                        // Execute the insert statement
//                        preparedStatement.executeUpdate();
//                    } catch (SQLException e) {
//                        e.printStackTrace();
//                        // Handle SQLException appropriately
//                    }
//                }
//
//                // Show a success message or update UI if needed
//                Platform.runLater(() -> {
//                    // Update UI or show a success message
//                    textarea_text.setText("Data from " + csvFilePath + " imported into the database successfully.");
//                });
//            } catch (IOException e) {
//                e.printStackTrace();
//                // Handle IOException appropriately
//            } finally {
//                connection.close(); // Close the connection after use
//            }
//        } catch (InterruptedException | ExecutionException | SQLException e) {
//            e.printStackTrace();
//            // Handle InterruptedException, ExecutionException, and SQLException appropriately
//        }
    }


    @FXML
    protected void convertToCsvClick() {
        //haal de text op uit de textarea
        StringBuilder csvData = new StringBuilder();
        csvData.append(textarea_text.getParagraphs());

        // Schrijf de CSV-geformatteerde string naar een CSV-bestand
        try (PrintWriter writer = new PrintWriter("orderitem_import.csv")) {
            writer.write(csvData.toString());
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

                    // Schrijf de kolomkoppen naar de CSV-geformatteerde string
                    for (int i = 1; i <= columnCount; i++) {
                        csvData.append("\"").append(metaData.getColumnName(i)).append("\"");
                        if (i < columnCount) {
                            csvData.append(",");
                        }
                    }
                    csvData.append("\n");

                    // Schrijf de gegevensrijen naar de CSV-geformatteerde string
                    while (resultSet.next()) {
                        for (int i = 1; i <= columnCount; i++) {
                            String value = resultSet.getString(i);
                            csvData.append("\"").append(value).append("\"");
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
