import { Button, Stack, Typography } from "@mui/material";
import {PopupService} from "./PopupService";

export default function PopupTest() {

    return (
        <Stack spacing={2} sx={{ p: 3 }}>
            <Typography variant="h5">
                Test Popup Global
            </Typography>

            <Button
                variant="contained"
                onClick={() =>
                    PopupService.open({
                        title: "Hello",
                        content: (
                            <div>
                                Ceci est un popup simple 🚀
                            </div>
                        ),
                    })
                }
            >
                Ouvrir popup simple
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={() =>

                    PopupService.open({
                        title: "Formulaire",
                        content: (
                            <Stack spacing={2}>
                                <input placeholder="Nom" />
                                <input placeholder="Email" />
                                <Button variant="contained">
                                    Envoyer
                                </Button>
                            </Stack>
                        ),
                    })
                }
            >
                Ouvrir popup formulaire
            </Button>

            <Button
                variant="contained"
                color="warning"
                onClick={() =>
                    PopupService.open({
                        title: "Composant avancé",
                        content: (
                            <Stack spacing={1}>
                                <Typography>
                                    Tu peux injecter n'importe quel composant ici
                                </Typography>

                                <Button variant="outlined">
                                    Action 1
                                </Button>

                                <Button variant="outlined">
                                    Action 2
                                </Button>
                            </Stack>
                        ),
                    })
                }
            >
                Popup avancé
            </Button>
        </Stack>
    );
}