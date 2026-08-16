import { Button, Paper, Stack, Typography } from "@mui/material";
import { AlertService } from "./AlertService";

export default function AlertTest() {

    return (
        <Paper sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
                Test des Alertes
            </Typography>

            <Stack spacing={2}>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                        AlertService.success(
                            "Succès",
                            "Le document a été enregistré avec succès."
                        )
                    }
                >
                    Success
                </Button>

                <Button
                    variant="contained"
                    color="info"
                    onClick={() =>
                        AlertService.info(
                            "Information",
                            "Une nouvelle mise à jour est disponible."
                        )
                    }
                >
                    Information
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                        AlertService.warning(
                            "Attention",
                            "Cette action est irréversible."
                        )
                    }
                >
                    Warning
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        AlertService.error(
                            "Erreur",
                            "Impossible de supprimer ce document."
                        )
                    }
                >
                    Error
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => {

                        AlertService.info(
                            "Information",
                            "Début du traitement."
                        );

                        setTimeout(() => {
                            AlertService.success(
                                "Succès",
                                "Traitement terminé."
                            );
                        }, 1000);

                    }}
                >
                    Simulation de traitement
                </Button>

            </Stack>
        </Paper>
    );
}