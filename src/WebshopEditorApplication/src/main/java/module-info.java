module nl.hva.webshopeditorapplication {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;

    opens nl.hva.webshopeditorapplication to javafx.fxml;
    exports nl.hva.webshopeditorapplication;
}