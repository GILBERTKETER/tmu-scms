# Generated by Django 5.0.6 on 2024-10-28 18:15

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="program",
            name="duration",
        ),
        migrations.RemoveField(
            model_name="program",
            name="level",
        ),
    ]
