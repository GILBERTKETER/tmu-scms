# Generated by Django 5.0.6 on 2024-11-01 09:53

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("safetymonitoring", "0002_incident_date"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="incident",
            name="reported_by",
        ),
    ]
