# Generated by Django 5.0.6 on 2024-11-06 09:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0009_enrollment_rfid"),
    ]

    operations = [
        migrations.AddField(
            model_name="enrollment",
            name="program",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="academics.program",
            ),
        ),
    ]