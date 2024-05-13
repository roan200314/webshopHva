package nl.hva.webshopeditorapplication;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class HelloController {
    @FXML
    private Label dataText;

    @FXML
    protected void showDataClick() {
        // Define your database connection parameters
        String host = "db.hbo-ict.cloud";
        String port = "3366";
        String user = "pb4a2324_yoolaacooree89";
        String jwt_key = "mYs3cr3tK3y";
        String databaseName = "pb4a2324_yoolaacooree89_roan";
        String password = "BOvMkDReOCTz283V";

        // Construct the JDBC URL
        String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + databaseName;

        try (Connection connection = DriverManager.getConnection(jdbcUrl, user, password)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM user");

            // Assuming your table has a column named "data" to retrieve
            if (resultSet.next()) {
                String data = resultSet.getString("data");
                dataText.setText(data);
            } else {
                dataText.setText("No data found");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            dataText.setText("Error occurred while retrieving data");
        }
    }
}