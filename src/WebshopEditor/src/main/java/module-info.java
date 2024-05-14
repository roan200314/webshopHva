module com.bramdekker.webshopeditor {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;

    opens com.bramdekker.webshopeditor to javafx.fxml;
    exports com.bramdekker.webshopeditor;
}