import { Button, Stack, Paper, Typography } from "@mui/material";
import {ToastService} from "./ToastService";

export default function ToastTest() {

    return (
        <Paper sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
                Test des Toasts
            </Typography>

            <Stack spacing={2}>
                <Button
                    variant="contained"
                    onClick={() =>
                        ToastService.success("Succès n°1")
                    }
                >
                    Success 1
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        ToastService.success("Succès n°2")
                    }
                >
                    Success 2
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        ToastService.info("Information n°1")
                    }
                >
                    Info 1
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        ToastService.info("Information n°2")
                    }
                >
                    Info 2
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                        ToastService.warning("Attention n°1")
                    }
                >
                    Warning 1
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                        ToastService.warning("Attention n°2")
                    }
                >
                    Warning 2
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        ToastService.error("Erreur n°1")
                    }
                >
                    Error 1
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        ToastService.error("Erreur n°2")
                    }
                >
                    Error 2
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => {
                        for (let i = 1; i <= 10; i++) {
                            ToastService.success(
                                `Toast automatique ${i}`
                            );
                        }
                    }}
                >
                    Générer 10 toasts
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        ToastService.success("Success");
                        ToastService.info("Info");
                        ToastService.warning("Warning");
                        ToastService.error("Error");
                    }}
                >
                    Générer 4 types
                </Button>
            </Stack>
        </Paper>
    );
}