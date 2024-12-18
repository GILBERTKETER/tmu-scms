# Generated by Django 5.0.6 on 2024-10-30 08:37

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Facilities",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("facility_name", models.CharField(max_length=200)),
                ("capcity", models.IntegerField(max_length=100)),
                ("status", models.CharField(default="Available", max_length=50)),
                ("facility_type", models.IntegerField(max_length=100)),
            ],
        ),
    ]
